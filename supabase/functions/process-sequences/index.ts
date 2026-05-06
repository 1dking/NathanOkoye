// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendMail } from "../_shared/smtp.ts";
import {
  getAssessmentStep,
  getPlaybookStep,
  PLAYBOOK_INTERVALS_DAYS,
  SEQUENCE_INTERVALS_DAYS,
  TierKey,
} from "../_shared/sequences.ts";

/**
 * Hourly cron job. Configure in Supabase:
 *   Database → Cron Jobs → New cron job
 *   Schedule: 0 * * * *  (every hour, on the hour)
 *   Command: select net.http_post(
 *     url   := 'https://<project>.supabase.co/functions/v1/process-sequences',
 *     headers := jsonb_build_object('Authorization', 'Bearer ' || (select value from vault.decrypted_secrets where name = 'service_role_key')),
 *     body  := '{}'::jsonb
 *   );
 *
 * Or simpler: trigger from any external scheduler that hits this URL hourly.
 */
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = getServiceClient();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  const nowIso = new Date().toISOString();

  // Pull every enrollment whose next-send time has arrived.
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

    const stepDef =
      sequenceType === "playbook"
        ? getPlaybookStep(stepIndex)
        : getAssessmentStep(sequenceType as TierKey, stepIndex);

    // No more steps in this sequence — mark complete and skip.
    if (!stepDef) {
      await supabase
        .from("sequence_enrollments")
        .update({ completed: true })
        .eq("id", enrollment.id);
      completed++;
      continue;
    }

    const unsubscribeUrl =
      `${supabaseUrl}/functions/v1/unsubscribe?token=${enrollment.id}`;
    const subject = stepDef.subject;
    const html = stepDef.build(
      enrollment.first_name,
      enrollment.total_score ?? 0,
      unsubscribeUrl,
    );

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

    // Even if SMTP failed we advance the step — otherwise a single bad
    // address would loop forever. Failures are visible in email_logs.

    const intervals =
      sequenceType === "playbook"
        ? PLAYBOOK_INTERVALS_DAYS
        : SEQUENCE_INTERVALS_DAYS[sequenceType as TierKey] ?? [];

    const nextStepIndex = stepIndex + 1;
    const nextInterval = intervals[nextStepIndex - 1]; // step1→intervals[0], step2→intervals[1], ...

    if (typeof nextInterval !== "number") {
      // Sequence is done.
      await supabase
        .from("sequence_enrollments")
        .update({ current_step: nextStepIndex, completed: true })
        .eq("id", enrollment.id);
      completed++;
    } else {
      const nextSendAt = new Date(
        Date.now() + nextInterval * 24 * 60 * 60 * 1000,
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
