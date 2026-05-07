import AdminSidebar from "@/components/admin/AdminSidebar";
import { getServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "info@nathanokoye.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authed = user?.email === ADMIN_EMAIL;

  // The login page is the one place inside /admin that renders unauthed.
  // The middleware also handles redirects, but layouts run for nested routes
  // first — we render plain children for the login page.
  if (!authed) {
    return <div className="admin-root admin-root--unauthed">{children}</div>;
  }

  return (
    <div className="admin-root">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
