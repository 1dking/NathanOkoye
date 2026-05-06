"use client";

import { useState } from "react";

/* =========================================================================
   CONFIG — swap these constants in when credentials are ready.
   The form silently no-ops the network calls while these placeholders
   remain in place, so the page is safe to deploy before wiring is done.

   On successful row insert into Supabase, a Database Webhook (or trigger)
   should call the same Edge Function the assessment uses to send a
   confirmation email via DreamHost SMTP — subject:
     "Your Visibility Playbook is on its way"
   ========================================================================= */
const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";
const SUPABASE_TABLE = "playbook_requests";

const isPlaceholder = (v: string) => !v || v.startsWith("YOUR_");

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
      first_name: fn,
      email: em,
      requested_at: new Date().toISOString(),
    };

    if (!isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON_KEY)) {
      try {
        const res = await fetch(
          `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${SUPABASE_TABLE}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.warn("Supabase playbook insert failed", res.status, await res.text().catch(() => ""));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Supabase playbook insert errored", err);
      }
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
