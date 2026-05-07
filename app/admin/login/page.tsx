"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setSubmitting(false);
      setError("Invalid credentials.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin</h1>
        <p className="admin-login-sub">Sign in to the command centre.</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
          {error && <p className="admin-form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
