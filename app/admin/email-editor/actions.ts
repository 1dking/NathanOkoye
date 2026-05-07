"use server";

import { revalidatePath } from "next/cache";
import { getServerClient, getServiceClient } from "@/lib/supabase-server";

const ADMIN_EMAIL = "info@nathanokoye.com";

async function requireAdmin() {
  const auth = getServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) throw new Error("unauthorized");
}

export interface TemplatePatch {
  subject?: string;
  body_html?: string;
  delay_days?: number;
  active?: boolean;
}

export async function saveTemplate(id: string, patch: TemplatePatch) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("email_templates")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/email-editor");
  return { ok: true as const };
}

export async function sendTestTemplate(id: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { data: tpl } = await supabase
    .from("email_templates")
    .select("subject, body_html")
    .eq("id", id)
    .maybeSingle();
  if (!tpl) return { ok: false as const, error: "Template not found" };

  // Sample variable substitution — same names the existing templates use.
  const sample: Record<string, string> = {
    first_name: "Sarah",
    total_score: "24",
    result_tier: "Following Templates",
    assessment_url: "https://nathanokoye.com/assessment",
    discovery_url: "https://nathanokoye.com/work-with-nathan",
    unsubscribe_url: "https://nathanokoye.com/unsubscribe",
  };
  const apply = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k) => sample[k] ?? `{{${k}}}`);

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-custom-email`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      to_email: ADMIN_EMAIL,
      first_name: sample.first_name,
      subject: `[TEST] ${apply(tpl.subject ?? "")}`,
      body_html: apply(tpl.body_html ?? ""),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }
  return { ok: true as const };
}
