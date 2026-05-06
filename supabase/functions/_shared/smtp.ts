import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a single email via DreamHost SMTP using the credentials in env.
 * Each call opens and closes its own connection so it's safe under concurrency.
 */
export async function sendMail({ to, subject, html }: SendArgs): Promise<void> {
  const host = Deno.env.get("SMTP_HOST");
  const port = parseInt(Deno.env.get("SMTP_PORT") ?? "465", 10);
  const user = Deno.env.get("SMTP_USER");
  const pass = Deno.env.get("SMTP_PASS");
  const fromName = Deno.env.get("SMTP_FROM_NAME") ?? "Nathan Okoye";

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS must be set");
  }

  const smtp = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: port === 465,
      auth: { username: user, password: pass },
    },
  });

  try {
    await smtp.send({
      from: `${fromName} <${user}>`,
      to,
      replyTo: user,
      subject,
      html,
      content: "auto",
    });
  } finally {
    try {
      await smtp.close();
    } catch {
      // ignore close errors
    }
  }
}
