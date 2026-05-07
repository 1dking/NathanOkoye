"use client";

import { useState, useTransition } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { sendCustomEmail } from "@/app/admin/leads/[id]/actions";

interface Props {
  leadId: string;
  email: string;
  firstName: string | null;
}

export default function LeadCustomEmail({ leadId, email, firstName }: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function handleSend() {
    setMsg(null);
    if (!subject.trim() || !body.trim()) {
      setMsg({ tone: "err", text: "Subject and body are required." });
      return;
    }
    startTransition(async () => {
      const res = await sendCustomEmail({
        lead_id: leadId,
        to_email: email,
        first_name: firstName,
        subject: subject.trim(),
        body_html: body,
      });
      if (res.ok) {
        setMsg({ tone: "ok", text: "Sent ✓" });
        setSubject("");
        setBody("");
      } else {
        setMsg({ tone: "err", text: res.error });
      }
    });
  }

  return (
    <div className="admin-custom-email">
      <label className="admin-field">
        <span>Subject</span>
        <input
          type="text"
          className="admin-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line"
        />
      </label>

      <label className="admin-field admin-field--full">
        <span>Body</span>
        <RichTextEditor value={body} onChange={setBody} placeholder="Write the email…" />
      </label>

      {showPreview && (
        <div className="admin-preview">
          <p className="admin-preview-label">Preview</p>
          <p className="admin-preview-subject"><strong>Subject:</strong> {subject || "(empty)"}</p>
          <div
            className="admin-preview-body"
            dangerouslySetInnerHTML={{ __html: body || "<p>(empty)</p>" }}
          />
        </div>
      )}

      <div className="admin-actions">
        <button
          type="button"
          className="admin-btn"
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? "Hide preview" : "Preview"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSend}
          disabled={pending}
        >
          {pending ? "Sending…" : "Send"}
        </button>
        {msg && (
          <span className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
