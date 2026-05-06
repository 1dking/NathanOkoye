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
 * Hourly cron — pulls every enrollment whose next_send_at has arrived
 * and dispatches the matching email_templates row.
 */
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = getServiceClient();
  const nowIso = new Date().toISOString();

  const { data: due, error } = await supabase
    .from("sequence_enrollments")
    .select("*")
    .lte("next_send_at", nowIso)
    .eq("completed", false)
    .eq("unsubscribed", false)
    .limit(200);

  if (error) {
    return jsonResponse({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;
  let completed = 0;

  for (const enrollment of due ?? []) {
    const stepIndex: number = enrollment.current_step ?? 1;
    const sequenceType: string = enrollment.sequence_type;

    const template = await getTemplate(sequenceType, stepIndex);

    // No template at this step → sequence is finished.
    if (!template) {
      await supabase
        .from("sequence_enrollments")
        .update({ completed: true })
        .eq("id", enrollment.id);
      completed++;
      continue;
    }

    const vars = {
      first_name: enrollment.first_name,
      score: enrollment.total_score ?? "",
      unsubscribe_url: unsubscribeUrl(enrollment.id),
    };
    const subject = applyVars(template.subject, vars);
    const html = applyVars(template.body_html, vars);

    let status: "sent" | "failed" = "sent";
    let errorText: string | null = null;
    try {
      await sendMail({ to: enrollment.email, subject, html });
      sent++;
    } catch (err) {
      status = "failed";
      errorText = String((err as Error).message ?? err);
      failed++;
    }

    await supabase.from("email_logs").insert({
      enrollment_id: enrollment.id,
      email: enrollment.email,
      subject,
      step: stepIndex,
      status,
      error: errorText,
    });

    // Advance step regardless of SMTP success — failures are logged, but
    // a single bad address must not block the rest of the queue.
    const nextStepIndex = stepIndex + 1;
    const nextTemplate = await getTemplate(sequenceType, nextStepIndex);

    if (!nextTemplate) {
      await supabase
        .from("sequence_enrollments")
        .update({ current_step: nextStepIndex, completed: true })
        .eq("id", enrollment.id);
      completed++;
    } else {
      const nextSendAt = new Date(
        Date.now() + nextTemplate.delay_days * 86400000,
      ).toISOString();
      await supabase
        .from("sequence_enrollments")
        .update({
          current_step: nextStepIndex,
          next_send_at: nextSendAt,
        })
        .eq("id", enrollment.id);
    }
  }

  return jsonResponse({
    processed: due?.length ?? 0,
    sent,
    failed,
    completed,
  });
});
