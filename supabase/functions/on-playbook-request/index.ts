// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";
import {
  applyVars,
  getTemplate,
  unsubscribeUrl,
} from "../_shared/templates.ts";

/**
 * Webhook handler for INSERT on playbook_requests.
 * Sends the immediate "Your Visibility Playbook is on its way" email,
 * enrolls in the playbook sequence.
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

  if (payload?.type !== "INSERT" || payload?.table !== "playbook_requests") {
    return jsonResponse({ ok: true, ignored: true });
  }

  const r = payload.record;
  if (!r?.id || !r?.email || !r?.first_name) {
    return jsonResponse({ error: "missing required fields" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const step0 = await getTemplate("playbook", 0);
  if (!step0) {
    return jsonResponse(
      { error: "no active template for playbook step 0" },
      { status: 500 },
    );
  }
  const step1 = await getTemplate("playbook", 1);

  const nextSendAt = step1
    ? new Date(Date.now() + step1.delay_days * 86400000)
    : new Date(Date.now() + 365 * 86400000);

  const { data: enrollment, error: enrollError } = await supabase
    .from("sequence_enrollments")
    .insert({
      playbook_request_id: r.id,
      email: r.email,
      first_name: r.first_name,
      sequence_type: "playbook",
      tier: null,
      total_score: null,
      current_step: 1,
      next_send_at: nextSendAt.toISOString(),
      completed: !step1,
    })
    .select()
    .single();

  if (enrollError || !enrollment) {
    return jsonResponse(
      { error: "enrollment failed", detail: enrollError?.message },
      { status: 500 },
    );
  }

  const vars = {
    first_name: r.first_name,
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

  await supabase
    .from("playbook_requests")
    .update({ sequence_enrolled: true })
    .eq("id", r.id);

  await supabase.from("crm_leads").upsert(
    {
      visitor_token: r.visitor_token ?? null,
      first_name: r.first_name,
      email: r.email,
    },
    { onConflict: "email" },
  );

  return jsonResponse({
    ok: true,
    enrollment_id: enrollment.id,
    email_status: status,
  });
});
