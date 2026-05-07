import { getServiceClient } from "@/lib/supabase-server";
import type { EmailLogRow } from "@/lib/admin-types";
import EmailLogsTable from "@/components/admin/EmailLogsTable";

export const dynamic = "force-dynamic";

async function loadLogs(): Promise<EmailLogRow[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("email_logs")
    .select("id, email, subject, step, status, sent_at, error, enrollment_id")
    .order("sent_at", { ascending: false })
    .limit(500);
  return (data ?? []) as EmailLogRow[];
}

export default async function AdminEmailsPage() {
  const rows = await loadLogs();
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-h1">Emails</h1>
        <p className="admin-page-sub">Most recent {rows.length.toLocaleString()}</p>
      </header>
      <EmailLogsTable initial={rows} />
    </div>
  );
}
