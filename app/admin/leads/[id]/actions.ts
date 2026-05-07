"use server";

import { revalidatePath } from "next/cache";
import { getServerClient, getServiceClient } from "@/lib/supabase-server";

const ADMIN_EMAIL = "info@nathanokoye.com";

async function requireAdmin() {
  const auth = getServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) {
    throw new Error("unauthorized");
  }
}

interface LeadPatch {
  status?: string | null;
  discovery_session_booked?: boolean;
  discovery_session_date?: string | null;
  is_client?: boolean;
  notes?: string | null;
}

export async function updateLead(id: string, patch: LeadPatch) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { error } = await supabase.from("crm_leads").update(patch).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true as const };
}

export async function sendAssessmentInvite(id: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { data: lead } = await supabase
    .from("crm_leads")
    .select("first_name, email")
    .eq("id", id)
    .maybeSingle();
  if (!lead) return { ok: false as const, error: "Lead not found" };

  const subject = "Your Strategic Authenticity Assessment is ready";
  const firstName = lead.first_name ?? "there";
  const body = `<p>Hi ${firstName},</p>
<p>The Strategic Authenticity Assessment takes about five minutes. It rates ten statements about how your brand currently shows up in the world, and the result identifies where the gap is between the work you do and how it is represented to the people you want to reach.</p>
<p><a href="https://nathanokoye.com/assessment">Take the assessment</a>.</p>
<p>— Nathan</p>`;

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-custom-email`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      to_email: lead.email,
      first_name: firstName,
      subject,
      body_html: body,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true as const };
}

export async function sendCustomEmail(input: {
  lead_id: string;
  to_email: string;
  first_name: string | null;
  subject: string;
  body_html: string;
}) {
  await requireAdmin();
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-custom-email`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      to_email: input.to_email,
      first_name: input.first_name ?? "there",
      subject: input.subject,
      body_html: input.body_html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }
  revalidatePath(`/admin/leads/${input.lead_id}`);
  return { ok: true as const };
}
