"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lead } from "@/lib/admin-types";

type SortKey = "score" | "date" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  "all",
  "lead",
  "assessment completed",
  "discovery booked",
  "client",
  "not a fit",
] as const;
const INTENT_OPTIONS = ["all", "low", "medium", "high"] as const;
const TIER_OPTIONS = [
  "all",
  "Strategically Authentic",
  "Authentic but Unfocused",
  "Following Templates",
  "Generic Content",
  "none",
] as const;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function leadsToCsv(rows: Lead[]): string {
  const headers = [
    "id",
    "first_name",
    "email",
    "lead_score",
    "intent_tier",
    "assessment_tier",
    "status",
    "discovery_session_booked",
    "discovery_session_date",
    "is_client",
    "created_at",
    "updated_at",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => csvEscape((r as unknown as Record<string, unknown>)[h])).join(","));
  }
  return lines.join("\n");
}

export default function LeadsTable({ initial }: { initial: Lead[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return initial.filter((r) => {
      if (statusFilter !== "all" && (r.status ?? "lead") !== statusFilter) return false;
      if (intentFilter !== "all" && (r.intent_tier ?? "low") !== intentFilter) return false;
      if (tierFilter !== "all") {
        if (tierFilter === "none") {
          if (r.assessment_tier) return false;
        } else if (r.assessment_tier !== tierFilter) return false;
      }
      if (s) {
        const haystack = `${r.first_name ?? ""} ${r.email}`.toLowerCase();
        if (!haystack.includes(s)) return false;
      }
      return true;
    });
  }, [initial, statusFilter, intentFilter, tierFilter, search]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === "score") {
        av = a.lead_score ?? 0;
        bv = b.lead_score ?? 0;
      } else if (sortKey === "status") {
        av = a.status ?? "";
        bv = b.status ?? "";
      } else {
        av = a.created_at ?? "";
        bv = b.created_at ?? "";
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  function handleExport() {
    const csv = leadsToCsv(sorted);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `leads-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function fmt(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString();
  }

  return (
    <>
      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={intentFilter}
          onChange={(e) => setIntentFilter(e.target.value)}
        >
          {INTENT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All intent" : s}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
        >
          {TIER_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All tiers" : s}
            </option>
          ))}
        </select>
        <button type="button" className="admin-btn" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th onClick={() => toggleSort("score")} className="is-sortable">
                Score{sortKey === "score" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </th>
              <th>Intent</th>
              <th>Assessment Tier</th>
              <th onClick={() => toggleSort("status")} className="is-sortable">
                Status{sortKey === "status" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </th>
              <th>Booked</th>
              <th onClick={() => toggleSort("date")} className="is-sortable">
                Date{sortKey === "date" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.id}
                className="admin-row-link"
                onClick={() => {
                  window.location.href = `/admin/leads/${r.id}`;
                }}
              >
                <td>
                  <Link href={`/admin/leads/${r.id}`}>
                    {r.first_name ?? "—"}
                  </Link>
                </td>
                <td>{r.email}</td>
                <td>{r.lead_score ?? 0}</td>
                <td>
                  <span className={`admin-pill admin-pill--${r.intent_tier ?? "low"}`}>
                    {r.intent_tier ?? "low"}
                  </span>
                </td>
                <td>{r.assessment_tier ?? "—"}</td>
                <td>{r.status ?? "lead"}</td>
                <td>{r.discovery_session_booked ? "Yes" : "—"}</td>
                <td>{fmt(r.created_at)}</td>
              </tr>
            ))}
            {!sorted.length && (
              <tr>
                <td colSpan={8} className="admin-muted" style={{ padding: "2rem", textAlign: "center" }}>
                  No leads match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
