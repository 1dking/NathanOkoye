import { NextResponse } from "next/server";
import { getServerClient, getServiceClient } from "@/lib/supabase-server";

const ADMIN_EMAIL = "info@nathanokoye.com";

export const dynamic = "force-dynamic";

export async function GET() {
  // Auth check via session cookie — only admin can read activity.
  const auth = getServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data: events } = await supabase
    .from("behavioral_events")
    .select("id, event_type, page, section, visitor_token, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // Stitch known emails via crm_leads on visitor_token.
  const tokens = Array.from(
    new Set((events ?? []).map((e) => e.visitor_token).filter(Boolean)),
  );
  let emailByToken = new Map<string, string>();
  if (tokens.length) {
    const { data: leads } = await supabase
      .from("crm_leads")
      .select("visitor_token, email")
      .in("visitor_token", tokens);
    emailByToken = new Map(
      (leads ?? []).map((l) => [l.visitor_token as string, l.email as string]),
    );
  }

  const items = (events ?? []).map((e) => ({
    id: e.id,
    event_type: e.event_type,
    page: e.page,
    section: e.section,
    email: emailByToken.get(e.visitor_token) ?? null,
    created_at: e.created_at,
  }));

  return NextResponse.json({ items });
}
