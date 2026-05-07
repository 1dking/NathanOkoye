"use server";

import { getServerClient } from "@/lib/supabase-server";

const ADMIN_EMAIL = "info@nathanokoye.com";

async function requireAdmin() {
  const auth = getServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) throw new Error("unauthorized");
}

export async function sendSmtpTest() {
  await requireAdmin();
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-custom-email`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      to_email: ADMIN_EMAIL,
      first_name: "Nathan",
      subject: "[SMTP test] from admin settings",
      body_html: `<p>This is a deliverability test sent at ${new Date().toISOString()}.</p>`,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }
  return { ok: true as const };
}
