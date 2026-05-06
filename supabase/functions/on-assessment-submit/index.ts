// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";
import {
  applyVars,
  getTemplate,
  tierKeyFromLabel,
  unsubscribeUrl,
} from "../_shared/templates.ts";

/**
 * Webhook handler for INSERT on assessment_submissions.
 * Reads Step 0 template from email_templates, sends it, then enrolls
 * the address in the rest of the sequence.
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

  if (payload?.type !== "INSERT" || payload?.table !== "assessment_submissions") {
    return jsonResponse({ ok: true, ignored: true });
  }

  const r = payload.record;
  if (!r?.id || !r?.email || !r?.first_name) {
    return jsonResponse({ error: "missing required fields" }, { status: 400 });
  }

  const sequenceType = tierKeyFromLabel(r.result_tier);
  const supabase = getServiceClient();

  // 1. Fetch step 0 template (the immediate result email).
  const step0 = await getTemplate(sequenceType, 0);
  if (!step0) {
    return jsonResponse(
      { error: `no active template for ${sequenceType} step 0` },
      { status: 500 },
    );
  }

  // 2. Fetch step 1 to know when next_send_at should be.
  const step1 = await getTemplate(sequenceType, 1);
  const nextSendAt = step1
    ? new Date(Date.now() + step1.delay_days * 86400000)
    : new Date(Date.now() + 365 * 86400000); // far future = effectively done

  // 3. Create the enrollment row first so we have the unsubscribe token.
  const { data: enrollment, error: enrollError } = await supabase
    .from("sequence_enrollments")
    .insert({
      submission_id: r.id,
      email: r.email,
      first_name: r.first_name,
      sequence_type: sequenceType,
      tier: sequenceType,
      total_score: r.total_score,
      current_step: 1,
      next_send_at: nextSendAt.toISOString(),
      completed: !step1, // if no step 1 exists, sequence is done
    })
    .select()
    .single();

  if (enrollError || !enrollment) {
    return jsonResponse(
      { error: "enrollment failed", detail: enrollError?.message },
      { status: 500 },
    );
  }

  // 4. Substitute variables and send.
  const vars = {
    first_name: r.first_name,
    score: r.total_score,
    unsubscribe_url: unsubscribeUrl(enrollment.id),
  };
  const subject = applyVars(step0.subject, vars);
  const html = applyVars(step0.body_html, vars);

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

  // 5. Mark assessment as enrolled and upsert into the CRM.
  await supabase
    .from("assessment_submissions")
    .update({ sequence_enrolled: true })
    .eq("id", r.id);

  await supabase.from("crm_leads").upsert(
    {
      visitor_token: r.visitor_token ?? null,
      first_name: r.first_name,
      email: r.email,
      assessment_score: r.total_score,
      assessment_tier: r.result_tier,
    },
    { onConflict: "email" },
  );

  return jsonResponse({
    ok: true,
    enrollment_id: enrollment.id,
    sequence_type: sequenceType,
    email_status: status,
  });
});
