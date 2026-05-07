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

/**
 * "Retry queued" — for a failed sequence email, reset the parent
 * enrollment so process-sequences picks it up on the next cron run.
 * Custom-email sends (step = 99, enrollment_id null) cannot be retried
 * here — the admin should re-send from the lead detail page.
 */
export async function retryFailedEmail(emailLogId: string) {
  await requireAdmin();
  const supabase = getServiceClient();
  const { data: log } = await supabase
    .from("email_logs")
    .select("enrollment_id, status")
    .eq("id", emailLogId)
    .maybeSingle();

  if (!log) return { ok: false as const, error: "Log row not found" };
  if (log.status !== "failed") return { ok: false as const, error: "Not a failed email" };
  if (!log.enrollment_id)
    return { ok: false as const, error: "Custom emails cannot be retried from the queue — re-send from the lead." };

  await supabase
    .from("sequence_enrollments")
    .update({ next_send_at: new Date().toISOString(), completed: false })
    .eq("id", log.enrollment_id);

  revalidatePath("/admin/emails");
  return { ok: true as const };
}
