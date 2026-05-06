// deno-lint-ignore-file no-explicit-any
import nodemailer from "npm:nodemailer@6.9.13";

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a single email via DreamHost SMTP using nodemailer.
 * Reads SMTP_HOST/PORT/USER/PASS/FROM_NAME from the function's env.
 *
 * One transporter per call — Supabase Edge Functions don't share state
 * across invocations reliably, so re-creating per call is the safer pattern.
 */
export async function sendMail({ to, subject, html }: SendArgs): Promise<void> {
  const host = Deno.env.get("SMTP_HOST");
  const port = parseInt(Deno.env.get("SMTP_PORT") ?? "465", 10);
  const user = Deno.env.get("SMTP_USER");
  const pass = Deno.env.get("SMTP_PASS");
  const fromName = Deno.env.get("SMTP_FROM_NAME") ?? "Nathan Okoye";

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASS must all be set");
  }

  const transporter = (nodemailer as any).createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `${fromName} <${user}>`,
    to,
    replyTo: user,
    subject,
    html,
  });

  // Best-effort close — nodemailer's pool variants need it; SMTP variant is a no-op.
  try {
    transporter.close?.();
  } catch {
    // ignore
  }
}
