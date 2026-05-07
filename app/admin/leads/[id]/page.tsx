import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceClient } from "@/lib/supabase-server";
import LeadCrmControls from "@/components/admin/LeadCrmControls";
import LeadCustomEmail from "@/components/admin/LeadCustomEmail";
import LeadAssessmentInvite from "@/components/admin/LeadAssessmentInvite";

export const dynamic = "force-dynamic";

const AREA_LABELS: Record<string, string> = {
  score_distinctiveness: "Distinctiveness",
  score_recognition: "Recognition",
  score_energy: "Energy",
  score_business_impact: "Business Impact",
  score_authentic_expression: "Authentic Expression",
};

const STATEMENT_TEXT: Record<number, string> = {
  1: "My content reflects a perspective that only I could have not the general language of my category.",
  2: "When someone reads my content without seeing my name, they can tell it's mine.",
  3: "People in my network refer me unprompted not just when directly asked.",
  4: "When someone describes the problem I solve, my name comes up in the room without me being there.",
  5: "Showing up online feels like a natural extension of how I already think and communicate.",
  6: "I create content consistently without it feeling like a task I am avoiding.",
  7: "My content directly opens conversations that lead to real client enquiries.",
  8: "The people who find me independently arrive already understanding what I do and who it's for.",
  9: "My brand communicates my expertise in my client's language, not my own.",
  10: "What my best clients would say about me matches what my public brand communicates to strangers.",
};

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServiceClient();

  const { data: lead } = await supabase
    .from("crm_leads")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!lead) notFound();

  // Visitor record (first_seen_at, last_seen_at, visit_count)
  const { data: visitor } = lead.visitor_token
    ? await supabase
        .from("visitors")
        .select("first_seen_at, last_seen_at, visit_count")
        .eq("visitor_token", lead.visitor_token)
        .maybeSingle()
    : { data: null };

  // Latest assessment submission (if any)
  const { data: assessment } = await supabase
    .from("assessment_submissions")
    .select("*")
    .eq("email", lead.email)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Behavioral timeline
  const { data: timeline } = lead.visitor_token
    ? await supabase
        .from("behavioral_events")
        .select("id, event_type, page, section, value, created_at")
        .eq("visitor_token", lead.visitor_token)
        .order("created_at", { ascending: false })
        .limit(500)
    : { data: [] };

  // Email history (by email — joining via enrollments could miss custom emails)
  const { data: enrollments } = await supabase
    .from("sequence_enrollments")
    .select("id")
    .eq("email", lead.email);
  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  let emails: Array<{
    id: string;
    subject: string | null;
    step: number | null;
    status: string | null;
    sent_at: string | null;
    error: string | null;
  }> = [];
  if (enrollmentIds.length) {
    const { data } = await supabase
      .from("email_logs")
      .select("id, subject, step, status, sent_at, error")
      .in("enrollment_id", enrollmentIds)
      .order("sent_at", { ascending: false });
    emails = (data ?? []) as typeof emails;
  }

  const tierClass = `admin-pill admin-pill--${lead.intent_tier ?? "low"}`;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <Link href="/admin/leads" className="admin-back">← Leads</Link>
        <h1 className="admin-h1">{lead.first_name ?? lead.email}</h1>
        <p className="admin-page-sub">{lead.email}</p>
      </header>

      {/* Section 1 — Identity */}
      <section className="admin-section">
        <h2 className="admin-h2">Identity</h2>
        <dl className="admin-defs">
          <div><dt>Lead score</dt><dd><span className={tierClass}>{lead.lead_score ?? 0}</span></dd></div>
          <div><dt>Intent tier</dt><dd>{lead.intent_tier ?? "low"}</dd></div>
          <div><dt>First seen</dt><dd>{fmtDate(visitor?.first_seen_at)}</dd></div>
          <div><dt>Last seen</dt><dd>{fmtDate(visitor?.last_seen_at)}</dd></div>
          <div><dt>Visit count</dt><dd>{visitor?.visit_count ?? 0}</dd></div>
        </dl>
      </section>

      {/* Section 2 — Assessment Result */}
      <section className="admin-section">
        <h2 className="admin-h2">Assessment Result</h2>
        {assessment ? (
          <>
            <dl className="admin-defs">
              <div><dt>Total score</dt><dd>{assessment.total_score} / 50</dd></div>
              <div><dt>Result tier</dt><dd>{assessment.result_tier}</dd></div>
              <div><dt>Submitted</dt><dd>{fmtDate(assessment.submitted_at)}</dd></div>
            </dl>
            <div className="admin-area-bars">
              {Object.entries(AREA_LABELS).map(([key, label]) => {
                const score = (assessment as Record<string, unknown>)[key] as number | null;
                const pct = ((score ?? 0) / 10) * 100;
                return (
                  <div key={key} className="admin-area-bar-row">
                    <span className="admin-area-bar-label">{label}</span>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill is-medium" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="admin-bar-count">{score ?? 0} / 10</span>
                  </div>
                );
              })}
            </div>
            <details className="admin-statements">
              <summary>All 10 statement ratings</summary>
              <ol className="admin-statements-list">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const v = (assessment as Record<string, unknown>)[`statement_${n}`] as number | null;
                  return (
                    <li key={n}>
                      <span className="admin-stmt-text">{STATEMENT_TEXT[n]}</span>
                      <span className="admin-stmt-score">{v ?? "—"} / 5</span>
                    </li>
                  );
                })}
              </ol>
            </details>
          </>
        ) : (
          <>
            <p className="admin-muted">Has not taken the assessment yet.</p>
            <LeadAssessmentInvite leadId={lead.id} />
          </>
        )}
      </section>

      {/* Section 3 — CRM Controls */}
      <section className="admin-section">
        <h2 className="admin-h2">CRM</h2>
        <LeadCrmControls
          leadId={lead.id}
          initial={{
            status: lead.status ?? "lead",
            discovery_session_booked: !!lead.discovery_session_booked,
            discovery_session_date: lead.discovery_session_date ?? null,
            is_client: !!lead.is_client,
            notes: lead.notes ?? "",
            updated_at: lead.updated_at,
          }}
        />
      </section>

      {/* Section 4 — Send Custom Email */}
      <section className="admin-section">
        <h2 className="admin-h2">Send Custom Email</h2>
        <LeadCustomEmail
          leadId={lead.id}
          email={lead.email}
          firstName={lead.first_name}
        />
      </section>

      {/* Section 5 — Behavioral Timeline */}
      <section className="admin-section">
        <h2 className="admin-h2">Behavioral Timeline</h2>
        <div className="admin-timeline">
          {(timeline ?? []).length === 0 && (
            <p className="admin-muted">No behavioral events recorded yet.</p>
          )}
          {(timeline ?? []).map((e) => (
            <div key={e.id} className="admin-timeline-row">
              <span className="admin-timeline-time">{fmtDate(e.created_at)}</span>
              <span className="admin-timeline-event">{e.event_type}</span>
              <span className="admin-timeline-page">{e.page}</span>
              <span className="admin-timeline-meta">
                {e.section ? `§ ${e.section}` : ""}
                {e.value !== null ? ` ${e.value}` : ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6 — Email History */}
      <section className="admin-section">
        <h2 className="admin-h2">Email History</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Step</th>
                <th>Status</th>
                <th>Sent at</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-muted" style={{ padding: "1.5rem", textAlign: "center" }}>
                    No emails recorded for this lead.
                  </td>
                </tr>
              )}
              {emails.map((e) => (
                <tr key={e.id} className={e.status === "failed" ? "admin-row-warn" : ""}>
                  <td>
                    {e.subject ?? "—"}
                    {e.error && <div className="admin-error-text">{e.error}</div>}
                  </td>
                  <td>{e.step ?? "—"}</td>
                  <td>{e.status ?? "—"}</td>
                  <td>{fmtDate(e.sent_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
