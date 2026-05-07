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

export async function pauseEnrollment(id: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  await supabase
    .from("sequence_enrollments")
    .update({ next_send_at: null })
    .eq("id", id);
  revalidatePath("/admin/sequences");
  return { ok: true as const };
}

export async function skipStep(id: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { data: row } = await supabase
    .from("sequence_enrollments")
    .select("current_step")
    .eq("id", id)
    .maybeSingle();
  const next = (row?.current_step ?? 0) + 1;
  // Schedule next send for now() so the cron picks it up on its next run.
  await supabase
    .from("sequence_enrollments")
    .update({ current_step: next, next_send_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/sequences");
  return { ok: true as const };
}

export async function unsubscribeEnrollment(id: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  await supabase
    .from("sequence_enrollments")
    .update({ unsubscribed: true })
    .eq("id", id);
  revalidatePath("/admin/sequences");
  return { ok: true as const };
}
