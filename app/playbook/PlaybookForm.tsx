"use client";

import { useState } from "react";
import { insertRow } from "@/lib/supabase";
import { getOrCreateVisitorToken } from "@/lib/visitor";

const SUPABASE_TABLE = "playbook_requests";

export default function PlaybookForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState<{ firstName: string; email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const fn = firstName.trim();
    const em = email.trim();
    if (!fn) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!em || !em.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const payload = {
      visitor_token: getOrCreateVisitorToken(),
      first_name: fn,
      email: em,
    };

    const result = await insertRow(SUPABASE_TABLE, payload);
    if (!result.ok) {
      // eslint-disable-next-line no-console
      console.warn("Playbook submission failed", result.status, result.error);
    }

    setSubmitting(false);
    setDone({ firstName: fn, email: em });
  };

  if (done) {
    return (
      <div className="gate-card playbook-confirm" style={{ maxWidth: '36rem', marginInline: 'auto' }}>
        <p className="eyebrow eyebrow-plain" style={{ marginBottom: '1rem' }}>You're in</p>
        <h2 style={{ marginBottom: '1rem' }}>The playbook is on its way, {done.firstName}.</h2>
        <p>
          Check <strong>{done.email}</strong> — your confirmation should arrive in the next minute or two. If it doesn't,
          have a look in promotions or spam.
        </p>
      </div>
    );
  }

  return (
    <div className="playbook-form-wrap" style={{ maxWidth: '36rem', marginInline: 'auto' }}>
      <form className="playbook-form" noValidate onSubmit={handleSubmit}>
        <div className="playbook-grid">
          <div className="field">
            <label htmlFor="pb-first-name">First Name</label>
            <input
              type="text"
              id="pb-first-name"
              name="first_name"
              placeholder="First name"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pb-email">Email Address</label>
            <input
              type="email"
              id="pb-email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg playbook-submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send Me the Playbook"}
        </button>
        {errorMsg && <p className="form-error" style={{ color: 'var(--accent)', marginTop: '0.75rem' }}>{errorMsg}</p>}
        <p className="playbook-note">
          You will also receive the CORE framework newsletter. Unsubscribe any time.
        </p>
      </form>
    </div>
  );
}
