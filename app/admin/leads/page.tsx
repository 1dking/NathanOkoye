import { getServiceClient } from "@/lib/supabase-server";
import type { Lead } from "@/lib/admin-types";
import LeadsTable from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

async function loadLeads(): Promise<Lead[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("crm_leads")
    .select(
      "id, first_name, email, lead_score, intent_tier, assessment_tier, status, discovery_session_booked, discovery_session_date, is_client, created_at, updated_at",
    )
    .order("created_at", { ascending: false });
  return (data ?? []) as Lead[];
}

export default async function AdminLeadsPage() {
  const leads = await loadLeads();
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-h1">Leads</h1>
        <p className="admin-page-sub">{leads.length.toLocaleString()} total</p>
      </header>
      <LeadsTable initial={leads} />
    </div>
  );
}
