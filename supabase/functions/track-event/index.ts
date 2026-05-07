// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { tierFromScore } from "../_shared/scoring.ts";

interface TrackEventBody {
  visitor_token?: string;
  event_type?: string;
  page?: string;
  section?: string | null;
  value?: number | null;
  metadata?: Record<string, any> | null;
}

const RETURN_VISIT_GAP_MS = 60 * 60 * 1000; // 1h gap = new visit (analytics only)

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, { status: 405 });
  }

  let body: TrackEventBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json" }, { status: 400 });
  }

  const visitor_token = (body.visitor_token ?? "").trim();
  const event_type = (body.event_type ?? "").trim();
  const page = (body.page ?? "").trim();

  if (!visitor_token || !event_type || !page) {
    return jsonResponse(
      { error: "visitor_token, event_type, page are required" },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();

  /* ---------- 1. Upsert visitor (analytics columns only) ----------
   * visit_count tracking here is for analytics. Lead scoring uses
   * `return_visit` events from behavioral_events, scored by the
   * calculate_lead_score() Postgres function — not visit_count. */
  const { data: existing } = await supabase
    .from("visitors")
    .select("visit_count, last_seen_at")
    .eq("visitor_token", visitor_token)
    .maybeSingle();

  let visit_count = 1;
  if (existing) {
    visit_count = existing.visit_count ?? 1;
    const lastSeen = existing.last_seen_at
      ? new Date(existing.last_seen_at).getTime()
      : 0;
    if (Date.now() - lastSeen > RETURN_VISIT_GAP_MS) {
      visit_count += 1;
    }
  } else {
    await supabase.from("visitors").insert({
      visitor_token,
      visit_count: 1,
    });
  }

  /* ---------- 2. Insert behavioral event (CRITICAL PATH) ----------
   * Failures here propagate as 500 — score recalc below is best-effort. */
  const { error: insertErr } = await supabase
    .from("behavioral_events")
    .insert({
      visitor_token,
      event_type,
      page,
      section: body.section ?? null,
      value: body.value ?? null,
      metadata: body.metadata ?? null,
    });
  if (insertErr) {
    return jsonResponse(
      { error: "event insert failed", detail: insertErr.message },
      { status: 500 },
    );
  }

  /* ---------- 3. Best-effort score recalc + propagation ---------- */
  let lead_score = 0;
  let intent_tier = tierFromScore(0);
  let events_counted = 0;
  let scoring_ok = false;

  try {
    const { data: scoreData, error: rpcErr } = await supabase.rpc(
      "calculate_lead_score",
      { p_visitor_token: visitor_token },
    );
    if (rpcErr) throw rpcErr;
    lead_score = typeof scoreData === "number" ? scoreData : 0;
    intent_tier = tierFromScore(lead_score);

    const { count } = await supabase
      .from("behavioral_events")
      .select("id", { count: "exact", head: true })
      .eq("visitor_token", visitor_token);
    events_counted = count ?? 0;
    scoring_ok = true;
  } catch (e) {
    console.warn("[track-event] score recalc failed:", e);
  }

  if (scoring_ok) {
    try {
      await supabase
        .from("visitors")
        .update({
          last_seen_at: new Date().toISOString(),
          visit_count,
          lead_score,
          intent_tier,
        })
        .eq("visitor_token", visitor_token);
    } catch (e) {
      console.warn("[track-event] visitors update failed:", e);
    }

    /* ---------- 4. Mirror to crm_leads if email known ---------- */
    try {
      const { data: a } = await supabase
        .from("assessment_submissions")
        .select("first_name, email")
        .eq("visitor_token", visitor_token)
        .order("submitted_at", { ascending: false })
        .limit(1);
      const { data: p } = await supabase
        .from("playbook_requests")
        .select("first_name, email")
        .eq("visitor_token", visitor_token)
        .order("requested_at", { ascending: false })
        .limit(1);

      const knownEmail =
        (a?.[0]?.email as string | undefined) ??
        (p?.[0]?.email as string | undefined);
      if (knownEmail) {
        const knownFirstName =
          a?.[0]?.first_name ?? p?.[0]?.first_name ?? null;
        await supabase.from("crm_leads").upsert(
          {
            visitor_token,
            first_name: knownFirstName,
            email: knownEmail,
            lead_score,
            intent_tier,
            // updated_at is set automatically by trg_crm_leads_updated_at
          },
          { onConflict: "email" },
        );
      }
    } catch (e) {
      console.warn("[track-event] crm_leads upsert failed:", e);
    }
  }

  return jsonResponse({
    visitor_token,
    lead_score,
    intent_tier,
    events_counted,
  });
});
