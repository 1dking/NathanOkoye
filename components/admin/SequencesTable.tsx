"use client";

import { useMemo, useState, useTransition } from "react";
import {
  pauseEnrollment,
  skipStep,
  unsubscribeEnrollment,
} from "@/app/admin/sequences/actions";
import { SEQUENCE_LENGTHS, type Enrollment } from "@/lib/admin-types";

const SEQUENCE_TYPES = [
  "all",
  "generic-content",
  "following-templates",
  "authentic-but-unfocused",
  "strategically-authentic",
  "playbook",
];

const STATE_FILTERS = ["all", "active", "completed", "unsubscribed"] as const;

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="admin-dots">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`admin-dot${i < current ? " is-filled" : ""}`}
          aria-hidden="true"
        />
      ))}
      <span className="admin-dots-label">
        {Math.min(current, total)} / {total}
      </span>
    </div>
  );
}

export default function SequencesTable({ initial }: { initial: Enrollment[] }) {
  const [seqFilter, setSeqFilter] = useState("all");
  const [stateFilter, setStateFilter] =
    useState<(typeof STATE_FILTERS)[number]>("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return initial.filter((r) => {
      if (seqFilter !== "all" && r.sequence_type !== seqFilter) return false;
      if (stateFilter === "active" && (r.completed || r.unsubscribed)) return false;
      if (stateFilter === "completed" && !r.completed) return false;
      if (stateFilter === "unsubscribed" && !r.unsubscribed) return false;
      return true;
    });
  }, [initial, seqFilter, stateFilter]);

  function handlePause(id: string) {
    startTransition(() => {
      void pauseEnrollment(id);
    });
  }
  function handleSkip(id: string) {
    if (!confirm("Skip the current step? The next email will be queued for the upcoming cron run.")) return;
    startTransition(() => {
      void skipStep(id);
    });
  }
  function handleUnsubscribe(id: string) {
    if (!confirm("Unsubscribe this lead? They will receive no further emails from this sequence.")) return;
    startTransition(() => {
      void unsubscribeEnrollment(id);
    });
  }

  return (
    <>
      <div className="admin-toolbar">
        <select
          className="admin-select"
          value={seqFilter}
          onChange={(e) => setSeqFilter(e.target.value)}
        >
          {SEQUENCE_TYPES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All sequences" : s}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={stateFilter}
          onChange={(e) =>
            setStateFilter(e.target.value as (typeof STATE_FILTERS)[number])
          }
        >
          {STATE_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All state" : s}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Sequence</th>
              <th>Tier</th>
              <th>Progress</th>
              <th>Next send</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const total = SEQUENCE_LENGTHS[r.sequence_type] ?? r.current_step;
              const state = r.unsubscribed
                ? "unsubscribed"
                : r.completed
                ? "completed"
                : "active";
              return (
                <tr key={r.id}>
                  <td>{r.first_name ?? "—"}</td>
                  <td>{r.email}</td>
                  <td>{r.sequence_type}</td>
                  <td>{r.tier ?? "—"}</td>
                  <td><ProgressDots current={r.current_step} total={total} /></td>
                  <td>{fmt(r.next_send_at)}</td>
                  <td>{state}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-btn-sm" disabled={pending || state !== "active"} onClick={() => handlePause(r.id)}>Pause</button>
                      <button type="button" className="admin-btn-sm" disabled={pending || state !== "active"} onClick={() => handleSkip(r.id)}>Skip step</button>
                      <button type="button" className="admin-btn-sm admin-btn-danger" disabled={pending || r.unsubscribed} onClick={() => handleUnsubscribe(r.id)}>Unsubscribe</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={8} className="admin-muted" style={{ padding: "2rem", textAlign: "center" }}>
                  No enrollments match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
