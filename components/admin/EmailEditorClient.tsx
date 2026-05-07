"use client";

import { useMemo, useState, useTransition } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  saveTemplate,
  sendTestTemplate,
} from "@/app/admin/email-editor/actions";
import type { EmailTemplate } from "@/lib/admin-types";

const SEQUENCE_LABELS: Record<string, string> = {
  "generic-content": "Generic Content",
  "following-templates": "Following Templates",
  "authentic-but-unfocused": "Authentic but Unfocused",
  "strategically-authentic": "Strategically Authentic",
  playbook: "Playbook",
};

const VARIABLES: { key: string; label: string }[] = [
  { key: "first_name", label: "Recipient first name" },
  { key: "total_score", label: "Assessment score" },
  { key: "result_tier", label: "Tier label" },
  { key: "assessment_url", label: "/assessment link" },
  { key: "discovery_url", label: "/work-with-nathan link" },
  { key: "unsubscribe_url", label: "Unsubscribe link" },
];

const SAMPLE: Record<string, string> = {
  first_name: "Sarah",
  total_score: "24",
  result_tier: "Following Templates",
  assessment_url: "https://nathanokoye.com/assessment",
  discovery_url: "https://nathanokoye.com/work-with-nathan",
  unsubscribe_url: "https://nathanokoye.com/unsubscribe",
};
const applyVars = (s: string) =>
  s.replace(/\{\{(\w+)\}\}/g, (_, k) => SAMPLE[k] ?? `{{${k}}}`);

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function EmailEditorClient({
  templates,
}: {
  templates: EmailTemplate[];
}) {
  // Group by sequence_type for the navigator.
  const grouped = useMemo(() => {
    const m = new Map<string, EmailTemplate[]>();
    for (const t of templates) {
      if (!m.has(t.sequence_type)) m.set(t.sequence_type, []);
      m.get(t.sequence_type)!.push(t);
    }
    return Array.from(m.entries());
  }, [templates]);

  const [selectedId, setSelectedId] = useState<string>(
    templates[0]?.id ?? "",
  );

  // Local edit buffer keyed by template id so unsaved edits survive nav.
  const [drafts, setDrafts] = useState<Record<string, EmailTemplate>>(() =>
    Object.fromEntries(templates.map((t) => [t.id, t])),
  );
  const current = drafts[selectedId];

  const [showPreview, setShowPreview] = useState(false);
  const [savedPing, setSavedPing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function patch(p: Partial<EmailTemplate>) {
    setDrafts((prev) => ({ ...prev, [selectedId]: { ...current, ...p } }));
  }

  function handleSave() {
    if (!current) return;
    setMsg(null);
    startTransition(async () => {
      const res = await saveTemplate(current.id, {
        subject: current.subject,
        body_html: current.body_html,
        delay_days: current.delay_days,
        active: current.active,
      });
      if (res.ok) {
        setSavedPing(true);
        setTimeout(() => setSavedPing(false), 2000);
        // Reflect updated_at locally so the navigator shows the new timestamp.
        patch({ updated_at: new Date().toISOString() });
      } else {
        setMsg({ tone: "err", text: res.error });
      }
    });
  }

  function handleSendTest() {
    if (!current) return;
    setMsg(null);
    startTransition(async () => {
      // Save first so the test reflects the latest edits.
      const saved = await saveTemplate(current.id, {
        subject: current.subject,
        body_html: current.body_html,
        delay_days: current.delay_days,
        active: current.active,
      });
      if (!saved.ok) {
        setMsg({ tone: "err", text: saved.error });
        return;
      }
      const res = await sendTestTemplate(current.id);
      if (res.ok) setMsg({ tone: "ok", text: "Test sent ✓" });
      else setMsg({ tone: "err", text: res.error });
    });
  }

  function handleToggleActive() {
    patch({ active: !current.active });
    startTransition(async () => {
      await saveTemplate(current.id, { active: !current.active });
    });
  }

  function insertVariable(key: string) {
    if (!current) return;
    // Naive append — the user can position by retyping if needed.
    patch({ body_html: (current.body_html ?? "") + `{{${key}}}` });
  }

  if (!current) {
    return <p className="admin-muted">No templates found.</p>;
  }

  return (
    <div className="admin-editor-shell">
      {/* Left: navigator */}
      <aside className="admin-editor-nav">
        {grouped.map(([type, items]) => (
          <div key={type} className="admin-editor-group">
            <h3 className="admin-editor-group-title">
              {SEQUENCE_LABELS[type] ?? type}
            </h3>
            <ul>
              {items.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`admin-editor-item${t.id === selectedId ? " is-active" : ""}`}
                    onClick={() => setSelectedId(t.id)}
                  >
                    <span className="admin-editor-item-step">Step {t.step}</span>
                    <span className="admin-editor-item-subject">
                      {(t.subject ?? "").slice(0, 40) || "(no subject)"}
                    </span>
                    <span className="admin-editor-item-meta">
                      {t.active ? "Active" : "Inactive"} · {fmt(t.updated_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Right: editor */}
      <div className="admin-editor-main">
        <div className="admin-editor-fields">
          <label className="admin-field">
            <span>Subject</span>
            <input
              type="text"
              className="admin-input"
              value={current.subject ?? ""}
              onChange={(e) => patch({ subject: e.target.value })}
            />
          </label>

          <label className="admin-field admin-field--narrow">
            <span>{current.step === 0 ? "Sends immediately" : `Send ${current.delay_days} days after previous step`}</span>
            <input
              type="number"
              min={0}
              className="admin-input"
              disabled={current.step === 0}
              value={current.delay_days}
              onChange={(e) =>
                patch({ delay_days: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
            />
          </label>
        </div>

        <div className="admin-editor-vars">
          <p className="admin-muted">Insert variable:</p>
          <div className="admin-var-chips">
            {VARIABLES.map((v) => (
              <button
                key={v.key}
                type="button"
                className="admin-chip"
                title={v.label}
                onClick={() => insertVariable(v.key)}
              >
                {`{{${v.key}}}`}
              </button>
            ))}
          </div>
        </div>

        <RichTextEditor
          value={current.body_html ?? ""}
          onChange={(html) => patch({ body_html: html })}
          minHeight={360}
        />

        {showPreview && (
          <div className="admin-preview">
            <p className="admin-preview-label">Preview</p>
            <p className="admin-preview-subject"><strong>Subject:</strong> {applyVars(current.subject ?? "")}</p>
            <div
              className="admin-preview-body"
              dangerouslySetInnerHTML={{ __html: applyVars(current.body_html ?? "") }}
            />
          </div>
        )}

        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={pending}
            onClick={handleSave}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={pending}
            onClick={handleSendTest}
          >
            Send test
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={current.active}
              onChange={handleToggleActive}
            />
            <span>{current.active ? "Active" : "Inactive"}</span>
          </label>
          {savedPing && <span className="admin-saved">Saved ✓</span>}
          {msg && (
            <span className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
              {msg.text}
            </span>
          )}
        </div>

        <p className="admin-muted admin-editor-footnote">
          Changes apply to future sends only. Emails already sent are not affected.
        </p>
      </div>
    </div>
  );
}
