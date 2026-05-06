// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";
import {
  getPlaybookConfirmationEmail,
  PLAYBOOK_INTERVALS_DAYS,
} from "../_shared/sequences.ts";

/**
 * Webhook handler for INSERT on playbook_requests.
 * Sends the immediate "Your Visibility Playbook is on its way" email,
 * enrolls the address in the playbook sequence, mirrors to crm_leads.
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
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  const nextSendAt = new Date(
    Date.now() + (PLAYBOOK_INTERVALS_DAYS[0] ?? 7) * 24 * 60 * 60 * 1000,
  );

  /* --- 1. Enrollment --- */
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

  /* --- 2. Confirmation email --- */
  const conf = getPlaybookConfirmationEmail();
  const subject = conf.subject;
  const html = conf.build(r.first_name, 0, unsubscribeUrl);

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

  /* --- 3. Mark request as enrolled --- */
  await supabase
    .from("playbook_requests")
    .update({ sequence_enrolled: true })
    .eq("id", r.id);

  /* --- 4. Upsert crm_leads --- */
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
