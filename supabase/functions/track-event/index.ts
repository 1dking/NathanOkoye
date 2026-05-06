// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { EVENT_SCORES, tierFromScore } from "../_shared/scoring.ts";

interface TrackEventBody {
  visitor_token?: string;
  event_type?: string;
  page?: string;
  section?: string | null;
  value?: number | null;
  metadata?: Record<string, any> | null;
}

const RETURN_VISIT_GAP_MS = 60 * 60 * 1000; // 1h gap = new visit
const MAX_RETURN_VISIT_BONUS_VISITS = 3;
const RETURN_VISIT_BONUS_PER_VISIT = 10;

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

  /* ---------- 1. Upsert visitor ---------- */
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
    await supabase
      .from("visitors")
      .update({
        last_seen_at: new Date().toISOString(),
        visit_count,
      })
      .eq("visitor_token", visitor_token);
  } else {
    await supabase.from("visitors").insert({
      visitor_token,
      visit_count: 1,
    });
  }

  /* ---------- 2. Insert behavioral event ---------- */
  await supabase.from("behavioral_events").insert({
    visitor_token,
    event_type,
    page,
    section: body.section ?? null,
    value: body.value ?? null,
    metadata: body.metadata ?? null,
  });

  /* ---------- 3. Recalculate lead score ---------- */
  const { data: events } = await supabase
    .from("behavioral_events")
    .select("event_type")
    .eq("visitor_token", visitor_token);

  let lead_score = 0;
  for (const e of events ?? []) {
    lead_score += EVENT_SCORES[e.event_type] ?? 0;
  }
  // Return-visit bonus, capped.
  const bonusVisits = Math.min(
    Math.max(visit_count - 1, 0),
    MAX_RETURN_VISIT_BONUS_VISITS,
  );
  lead_score += bonusVisits * RETURN_VISIT_BONUS_PER_VISIT;

  const intent_tier = tierFromScore(lead_score);

  /* ---------- 4. Save score to visitors ---------- */
  await supabase
    .from("visitors")
    .update({ lead_score, intent_tier })
    .eq("visitor_token", visitor_token);

  /* ---------- 5. Mirror to crm_leads if email known ---------- */
  // We only have an email if the visitor has previously submitted a form.
  // Look up by visitor_token in assessment_submissions / playbook_requests.
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
    const knownFirstName = a?.[0]?.first_name ?? p?.[0]?.first_name ?? null;
    await supabase.from("crm_leads").upsert(
      {
        visitor_token,
        first_name: knownFirstName,
        email: knownEmail,
        lead_score,
        intent_tier,
      },
      { onConflict: "email" },
    );
  }

  return jsonResponse({ visitor_token, lead_score, intent_tier });
});
