import { getServiceClient } from "@/lib/supabase-server";
import type { EmailTemplate } from "@/lib/admin-types";
import EmailEditorClient from "@/components/admin/EmailEditorClient";

export const dynamic = "force-dynamic";

async function loadTemplates(): Promise<EmailTemplate[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("email_templates")
    .select("id, sequence_type, tier, step, subject, body_html, delay_days, active, updated_at")
    .order("sequence_type", { ascending: true })
    .order("step", { ascending: true });
  return (data ?? []) as EmailTemplate[];
}

export default async function AdminEmailEditorPage() {
  const templates = await loadTemplates();
  return (
    <div className="admin-page admin-page--full">
      <header className="admin-page-header">
        <h1 className="admin-h1">Email Editor</h1>
        <p className="admin-page-sub">
          Edit template subjects, bodies, and delays. Changes apply to future sends only —
          emails already sent are not affected.
        </p>
      </header>
      <EmailEditorClient templates={templates} />
    </div>
  );
}
