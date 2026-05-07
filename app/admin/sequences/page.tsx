import { getServiceClient } from "@/lib/supabase-server";
import type { Enrollment } from "@/lib/admin-types";
import SequencesTable from "@/components/admin/SequencesTable";

export const dynamic = "force-dynamic";

async function loadEnrollments(): Promise<Enrollment[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("sequence_enrollments")
    .select(
      "id, email, first_name, sequence_type, tier, current_step, next_send_at, completed, unsubscribed, enrolled_at",
    )
    .order("enrolled_at", { ascending: false });
  return (data ?? []) as Enrollment[];
}

export default async function AdminSequencesPage() {
  const rows = await loadEnrollments();
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-h1">Sequences</h1>
        <p className="admin-page-sub">{rows.length.toLocaleString()} enrollments</p>
      </header>
      <SequencesTable initial={rows} />
    </div>
  );
}
