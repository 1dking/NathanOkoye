"use client";

import { useState, useTransition } from "react";
import { sendSmtpTest } from "@/app/admin/settings/actions";

export default function SmtpTestButton() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function handleClick() {
    setMsg(null);
    startTransition(async () => {
      const res = await sendSmtpTest();
      if (res.ok) setMsg({ tone: "ok", text: "Sent successfully" });
      else setMsg({ tone: "err", text: res.error });
    });
  }

  return (
    <div className="admin-actions">
      <button
        type="button"
        className="admin-btn admin-btn-primary"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send test email"}
      </button>
      {msg && (
        <span className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
          {msg.text}
        </span>
      )}
    </div>
  );
}
