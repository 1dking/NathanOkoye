// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";

/**
 * Send an ad-hoc email from the admin dashboard. Logs every send (success
 * or failure) to email_logs with step = 99 so it's distinguishable from
 * sequence emails.
 *
 * Body:
 *   { to_email, first_name, subject, body_html }
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

  const to_email = (payload?.to_email ?? "").toString().trim();
  const subject = (payload?.subject ?? "").toString().trim();
  const body_html = (payload?.body_html ?? "").toString();
  const first_name = (payload?.first_name ?? "").toString().trim() || null;

  if (!to_email || !subject || !body_html) {
    return jsonResponse(
      { error: "to_email, subject, body_html are required" },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();
  let status: "sent" | "failed" = "sent";
  let errorMsg: string | null = null;

  try {
    await sendMail({ to: to_email, subject, html: body_html });
  } catch (e: any) {
    status = "failed";
    errorMsg = e?.message ?? String(e);
  }

  // Log regardless of outcome.
  await supabase.from("email_logs").insert({
    enrollment_id: null,
    email: to_email,
    subject,
    step: 99,
    sent_at: new Date().toISOString(),
    status,
    error: errorMsg,
  });

  if (status === "failed") {
    return jsonResponse({ ok: false, error: errorMsg }, { status: 500 });
  }
  return jsonResponse({ ok: true });
});
