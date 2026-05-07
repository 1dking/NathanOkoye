import { getServiceClient } from "@/lib/supabase-server";
import ActivityFeed from "@/components/admin/ActivityFeed";

export const dynamic = "force-dynamic";

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface Counts {
  totalLeads: number;
  assessmentsThisWeek: number;
  playbookRequestsThisWeek: number;
  activeSequences: number;
  emailsSentThisWeek: number;
  emailsFailedThisWeek: number;
  visitorsLow: number;
  visitorsMedium: number;
  visitorsHigh: number;
}

async function loadCounts(): Promise<Counts> {
  const supabase = getServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const head = (q: PromiseLike<{ count: number | null }>) =>
    Promise.resolve(q).then((r) => r.count ?? 0);

  const [
    totalLeads,
    assessmentsThisWeek,
    playbookRequestsThisWeek,
    activeSequences,
    emailsSentThisWeek,
    emailsFailedThisWeek,
    visitorsLow,
    visitorsMedium,
    visitorsHigh,
  ] = await Promise.all([
    head(supabase.from("crm_leads").select("id", { count: "exact", head: true })),
    head(
      supabase
        .from("assessment_submissions")
        .select("id", { count: "exact", head: true })
        .gte("submitted_at", sevenDaysAgo),
    ),
    head(
      supabase
        .from("playbook_requests")
        .select("id", { count: "exact", head: true })
        .gte("requested_at", sevenDaysAgo),
    ),
    head(
      supabase
        .from("sequence_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("completed", false)
        .eq("unsubscribed", false),
    ),
    head(
      supabase
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .gte("sent_at", sevenDaysAgo)
        .eq("status", "sent"),
    ),
    head(
      supabase
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .gte("sent_at", sevenDaysAgo)
        .eq("status", "failed"),
    ),
    head(
      supabase
        .from("visitors")
        .select("visitor_token", { count: "exact", head: true })
        .eq("intent_tier", "low"),
    ),
    head(
      supabase
        .from("visitors")
        .select("visitor_token", { count: "exact", head: true })
        .eq("intent_tier", "medium"),
    ),
    head(
      supabase
        .from("visitors")
        .select("visitor_token", { count: "exact", head: true })
        .eq("intent_tier", "high"),
    ),
  ]);

  return {
    totalLeads,
    assessmentsThisWeek,
    playbookRequestsThisWeek,
    activeSequences,
    emailsSentThisWeek,
    emailsFailedThisWeek,
    visitorsLow,
    visitorsMedium,
    visitorsHigh,
  };
}

export default async function AdminDashboardPage() {
  const counts = await loadCounts();
  const totalIntent = counts.visitorsLow + counts.visitorsMedium + counts.visitorsHigh;
  const pct = (n: number) => (totalIntent > 0 ? (n / totalIntent) * 100 : 0);

  const cards: { label: string; value: number; tone?: "default" | "warn" }[] = [
    { label: "Total Leads", value: counts.totalLeads },
    { label: "Assessments This Week", value: counts.assessmentsThisWeek },
    { label: "Playbook Requests This Week", value: counts.playbookRequestsThisWeek },
    { label: "Active Sequences", value: counts.activeSequences },
    { label: "Emails Sent This Week", value: counts.emailsSentThisWeek },
    {
      label: "Failed Emails This Week",
      value: counts.emailsFailedThisWeek,
      tone: counts.emailsFailedThisWeek > 0 ? "warn" : "default",
    },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-h1">Command Centre</h1>
        <p className="admin-page-sub">{formatToday()}</p>
      </header>

      <section className="admin-card-grid">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`admin-stat-card${c.tone === "warn" ? " is-warn" : ""}`}
          >
            <p className="admin-stat-label">{c.label}</p>
            <p className="admin-stat-value">{c.value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Lead Score Distribution</h2>
        <div className="admin-bar-list">
          {[
            { label: "Low intent", count: counts.visitorsLow, klass: "is-low" },
            { label: "Medium intent", count: counts.visitorsMedium, klass: "is-medium" },
            { label: "High intent", count: counts.visitorsHigh, klass: "is-high" },
          ].map((row) => (
            <div key={row.label} className="admin-bar-row">
              <span className="admin-bar-label">{row.label}</span>
              <div className="admin-bar-track">
                <div
                  className={`admin-bar-fill ${row.klass}`}
                  style={{ width: `${pct(row.count)}%` }}
                />
              </div>
              <span className="admin-bar-count">{row.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Recent Activity</h2>
        <ActivityFeed />
      </section>
    </div>
  );
}
