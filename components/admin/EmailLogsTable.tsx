"use client";

import { useMemo, useState, useTransition } from "react";
import { retryFailedEmail } from "@/app/admin/emails/actions";
import type { EmailLogRow } from "@/lib/admin-types";

const STATUS_FILTERS = ["all", "sent", "failed"] as const;

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function EmailLogsTable({ initial }: { initial: EmailLogRow[] }) {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ id: string; tone: "ok" | "err"; text: string } | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return initial;
    return initial.filter((r) => r.status === filter);
  }, [initial, filter]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRetry(id: string) {
    setMsg(null);
    startTransition(async () => {
      const res = await retryFailedEmail(id);
      if (res.ok) setMsg({ id, tone: "ok", text: "Retry queued ✓" });
      else setMsg({ id, tone: "err", text: res.error });
    });
  }

  return (
    <>
      <div className="admin-toolbar">
        <select
          className="admin-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All emails" : s}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Subject</th>
              <th>Step</th>
              <th>Status</th>
              <th>Sent at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const isFailed = r.status === "failed";
              const open = expanded.has(r.id);
              return (
                <>
                  <tr key={r.id} className={isFailed ? "admin-row-warn" : ""}>
                    <td>{r.email}</td>
                    <td>
                      {r.subject ?? "—"}
                      {isFailed && r.error && (
                        <button
                          type="button"
                          className="admin-link-btn"
                          onClick={() => toggle(r.id)}
                        >
                          {open ? "Hide error" : "Show error"}
                        </button>
                      )}
                    </td>
                    <td>{r.step ?? "—"}</td>
                    <td>{r.status ?? "—"}</td>
                    <td>{fmt(r.sent_at)}</td>
                    <td>
                      {isFailed && (
                        <>
                          <button
                            type="button"
                            className="admin-btn-sm"
                            disabled={pending}
                            onClick={() => handleRetry(r.id)}
                          >
                            Retry
                          </button>
                          {msg?.id === r.id && (
                            <span className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
                              {" "}{msg.text}
                            </span>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                  {open && r.error && (
                    <tr key={`${r.id}-error`} className="admin-row-warn">
                      <td colSpan={6} className="admin-error-detail">{r.error}</td>
                    </tr>
                  )}
                </>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className="admin-muted" style={{ padding: "2rem", textAlign: "center" }}>
                  No emails match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
