"use client";

import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) {
      setMsg({ tone: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ tone: "err", text: "New passwords do not match." });
      return;
    }
    setSubmitting(true);
    const supabase = getBrowserClient();

    // Verify current password by re-signing in. Supabase doesn't expose
    // a "verify password" endpoint; this is the standard workaround.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setSubmitting(false);
      setMsg({ tone: "err", text: "No authenticated session." });
      return;
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInErr) {
      setSubmitting(false);
      setMsg({ tone: "err", text: "Current password is incorrect." });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    setSubmitting(false);
    if (error) {
      setMsg({ tone: "err", text: error.message });
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setMsg({ tone: "ok", text: "Password updated ✓" });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-pwd-form">
      <label className="admin-field">
        <span>Current password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>New password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      <div className="admin-actions">
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={submitting}
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
        {msg && (
          <span className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
