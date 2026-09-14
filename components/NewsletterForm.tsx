"use client";

import { useState } from "react";
import { insertRow } from "@/lib/supabase";
import { getOrCreateVisitorToken } from "@/lib/visitor";
import { track } from "@/lib/tracker";

const SUPABASE_TABLE = "newsletter_subscribers";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const em = email.trim();
    if (!em || !em.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const result = await insertRow(SUPABASE_TABLE, {
      visitor_token: getOrCreateVisitorToken(),
      email: em,
    });

    setSubmitting(false);

    if (!result.ok) {
      setErrorMsg("Something went wrong. Email nathan@ocidm.com and I'll add you directly.");
      return;
    }

    track("newsletter_subscribed");
    setDone(true);
  };

  if (done) {
    return (
      <div className="playbook-confirm" style={{ maxWidth: "32rem" }}>
        <p>
          <strong>You&apos;re on the list.</strong> New pieces land in your inbox when they&apos;re
          worth publishing, not on a schedule.
        </p>
      </div>
    );
  }

  return (
    <form className="playbook-form" noValidate onSubmit={handleSubmit} style={{ maxWidth: "32rem" }}>
      <div className="field">
        <label htmlFor="nl-email">Email Address</label>
        <input
          type="email"
          id="nl-email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary playbook-submit" disabled={submitting}>
        {submitting ? "Subscribing…" : "Subscribe"}
      </button>
      {errorMsg && (
        <p className="form-error" style={{ color: "var(--accent)", marginTop: "0.75rem" }}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
