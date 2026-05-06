// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";
import {
  getStep0Email,
  SEQUENCE_INTERVALS_DAYS,
  TIER_DETAIL,
  tierKeyFromLabel,
} from "../_shared/sequences.ts";

/**
 * Webhook handler for INSERT on assessment_submissions.
 * Configure in Supabase: Database → Webhooks → "on-assessment-submit"
 *   Source: assessment_submissions, Events: INSERT
 *   HTTP: POST <function-url>
 *   Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 */
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json" }, { status: 400 });
  }

  // Supabase database webhook payload shape:
  // { type: 'INSERT', table, schema, record, old_record }
  if (payload?.type !== "INSERT" || payload?.table !== "assessment_submissions") {
    return jsonResponse({ ok: true, ignored: true });
  }

  const r = payload.record;
  if (!r?.id || !r?.email || !r?.first_name) {
    return jsonResponse({ error: "missing required fields" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  const tier = tierKeyFromLabel(r.result_tier);
  const intervals = SEQUENCE_INTERVALS_DAYS[tier];
  const nextSendAt = new Date(
    Date.now() + (intervals[0] ?? 7) * 24 * 60 * 60 * 1000,
  );

  /* --- 1. Create the enrollment row --- */
  const { data: enrollment, error: enrollError } = await supabase
    .from("sequence_enrollments")
    .insert({
      submission_id: r.id,
      email: r.email,
      first_name: r.first_name,
      sequence_type: tier,
      tier,
      total_score: r.total_score,
      current_step: 1, // step 0 sent immediately, step 1 is next
      next_send_at: nextSendAt.toISOString(),
    })
    .select()
    .single();

  if (enrollError || !enrollment) {
    return jsonResponse(
      { error: "enrollment failed", detail: enrollError?.message },
      { status: 500 },
    );
  }

  const unsubscribeUrl =
    `${supabaseUrl}/functions/v1/unsubscribe?token=${enrollment.id}`;

  /* --- 2. Build + send Step 0 result email --- */
  const step0 = getStep0Email(tier);
  const subject = step0.subject;
  const html = step0.build(r.first_name, r.total_score, unsubscribeUrl);

  let status: "sent" | "failed" = "sent";
  let errorText: string | null = null;
  try {
    await sendMail({ to: r.email, subject, html });
  } catch (err) {
    status = "failed";
    errorText = String((err as Error).message ?? err);
  }

  await supabase.from("email_logs").insert({
    enrollment_id: enrollment.id,
    email: r.email,
    subject,
    step: 0,
    status,
    error: errorText,
  });

  /* --- 3. Mark assessment as enrolled --- */
  await supabase
    .from("assessment_submissions")
    .update({ sequence_enrolled: true })
    .eq("id", r.id);

  /* --- 4. Upsert crm_leads --- */
  await supabase.from("crm_leads").upsert(
    {
      visitor_token: r.visitor_token ?? null,
      first_name: r.first_name,
      email: r.email,
      assessment_score: r.total_score,
      assessment_tier: TIER_DETAIL[tier].label,
    },
    { onConflict: "email" },
  );

  return jsonResponse({
    ok: true,
    enrollment_id: enrollment.id,
    tier,
    email_status: status,
  });
});
