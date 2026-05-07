"use client";

import { useState, useTransition } from "react";
import { updateLead } from "@/app/admin/leads/[id]/actions";

const STATUS_OPTIONS = [
  "lead",
  "assessment completed",
  "discovery booked",
  "client",
  "not a fit",
];

interface Props {
  leadId: string;
  initial: {
    status: string;
    discovery_session_booked: boolean;
    discovery_session_date: string | null;
    is_client: boolean;
    notes: string;
    updated_at: string | null;
  };
}

function fmt(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString();
}

export default function LeadCrmControls({ leadId, initial }: Props) {
  const [status, setStatus] = useState(initial.status);
  const [booked, setBooked] = useState(initial.discovery_session_booked);
  const [bookedDate, setBookedDate] = useState(
    initial.discovery_session_date
      ? initial.discovery_session_date.slice(0, 10)
      : "",
  );
  const [isClient, setIsClient] = useState(initial.is_client);
  const [notes, setNotes] = useState(initial.notes);
  const [savedPing, setSavedPing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(initial.updated_at);
  const [, startTransition] = useTransition();

  function flashSaved(newUpdatedAt?: string) {
    setSavedPing(true);
    if (newUpdatedAt) setUpdatedAt(newUpdatedAt);
    setTimeout(() => setSavedPing(false), 2000);
  }

  function persist(patch: Parameters<typeof updateLead>[1]) {
    startTransition(async () => {
      const res = await updateLead(leadId, patch);
      if (res.ok) flashSaved(new Date().toISOString());
    });
  }

  return (
    <div className="admin-crm-grid">
      <label className="admin-field">
        <span>Status</span>
        <select
          className="admin-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            persist({ status: e.target.value });
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="admin-field admin-field--toggle">
        <input
          type="checkbox"
          checked={booked}
          onChange={(e) => {
            setBooked(e.target.checked);
            persist({ discovery_session_booked: e.target.checked });
          }}
        />
        <span>Discovery session booked</span>
      </label>

      {booked && (
        <label className="admin-field">
          <span>Discovery session date</span>
          <input
            type="date"
            className="admin-input"
            value={bookedDate}
            onChange={(e) => {
              setBookedDate(e.target.value);
              persist({
                discovery_session_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null,
              });
            }}
          />
        </label>
      )}

      <label className="admin-field admin-field--toggle">
        <input
          type="checkbox"
          checked={isClient}
          onChange={(e) => {
            setIsClient(e.target.checked);
            persist({ is_client: e.target.checked });
          }}
        />
        <span>Is client</span>
      </label>

      <label className="admin-field admin-field--full">
        <span>Notes</span>
        <textarea
          className="admin-textarea"
          rows={5}
          placeholder="Add notes about this lead…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => persist({ notes })}
        />
      </label>

      <p className="admin-saved-line">
        {savedPing && <span className="admin-saved">Saved ✓</span>}
        {updatedAt && (
          <span className="admin-muted"> Last updated {fmt(updatedAt)}</span>
        )}
      </p>
    </div>
  );
}
