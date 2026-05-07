"use client";

import { useState, useTransition } from "react";
import { sendAssessmentInvite } from "@/app/admin/leads/[id]/actions";

export default function LeadAssessmentInvite({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function handleClick() {
    setMsg(null);
    startTransition(async () => {
      const res = await sendAssessmentInvite(leadId);
      if (res.ok) setMsg({ tone: "ok", text: "Invite sent ✓" });
      else setMsg({ tone: "err", text: res.error });
    });
  }

  return (
    <div>
      <button
        type="button"
        className="admin-btn admin-btn-primary"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send assessment invite"}
      </button>
      {msg && (
        <p className={msg.tone === "ok" ? "admin-saved" : "admin-form-error"}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
