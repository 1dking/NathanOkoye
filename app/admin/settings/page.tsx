import { getServiceClient } from "@/lib/supabase-server";
import SmtpTestButton from "@/components/admin/SmtpTestButton";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

const TABLES = [
  "visitors",
  "behavioral_events",
  "assessment_submissions",
  "playbook_requests",
  "sequence_enrollments",
  "email_logs",
  "email_templates",
  "crm_leads",
  "admin_users",
];

async function loadStatus() {
  const supabase = getServiceClient();

  // Probe Supabase by counting one row to verify connectivity.
  let supabaseOk = true;
  try {
    const probe = await supabase
      .from("visitors")
      .select("visitor_token", { count: "exact", head: true });
    if (probe.error) supabaseOk = false;
  } catch {
    supabaseOk = false;
  }

  // Counts per table — best-effort, skip any that error.
  const counts: Record<string, number> = {};
  await Promise.all(
    TABLES.map(async (t) => {
      try {
        const { count } = await supabase
          .from(t)
          .select("*", { count: "exact", head: true });
        counts[t] = count ?? 0;
      } catch {
        counts[t] = -1;
      }
    }),
  );

  // Cron job state — uses pg_cron tables; may fail without privilege.
  const cronInfo: {
    last_run: string | null;
    sent_in_last_run: number;
  } = { last_run: null, sent_in_last_run: 0 };
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("email_logs")
      .select("id", { count: "exact", head: true })
      .gte("sent_at", oneHourAgo);
    cronInfo.sent_in_last_run = count ?? 0;
  } catch {
    /* swallow */
  }

  // SMTP creds (display only) — read from env so we surface what's wired.
  const smtp = {
    host: process.env.SMTP_HOST ?? "(set in Supabase secrets)",
    port: process.env.SMTP_PORT ?? "(set in Supabase secrets)",
    user: process.env.SMTP_USER ?? "(set in Supabase secrets)",
  };

  return { supabaseOk, counts, cronInfo, smtp };
}

export default async function AdminSettingsPage() {
  const { supabaseOk, counts, cronInfo, smtp } = await loadStatus();

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-h1">Settings</h1>
      </header>

      <section className="admin-section">
        <h2 className="admin-h2">SMTP Status</h2>
        <dl className="admin-defs">
          <div><dt>Host</dt><dd>{smtp.host}</dd></div>
          <div><dt>Port</dt><dd>{smtp.port}</dd></div>
          <div><dt>User</dt><dd>{smtp.user}</dd></div>
        </dl>
        <SmtpTestButton />
        <p className="admin-muted">
          Note: SMTP credentials are stored as Edge Function secrets in Supabase
          and aren't exposed to the Next.js process. The values shown above
          fall back to placeholders unless mirrored into the deployment env.
        </p>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Supabase Status</h2>
        <p>
          <span className={`admin-dot-status ${supabaseOk ? "is-ok" : "is-bad"}`} />
          {supabaseOk ? "Connected" : "Connection error"}
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Table</th><th>Rows</th></tr>
            </thead>
            <tbody>
              {TABLES.map((t) => (
                <tr key={t}>
                  <td>{t}</td>
                  <td>{counts[t] === -1 ? "error" : counts[t].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Sequence Schedule</h2>
        <p>Runs every hour on the hour (cron <code>0 * * * *</code>).</p>
        <p>
          <strong>Emails sent in the last hour:</strong>{" "}
          {cronInfo.sent_in_last_run.toLocaleString()}
        </p>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Admin Account</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
