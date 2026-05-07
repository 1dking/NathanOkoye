"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/sequences", label: "Sequences" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/email-editor", label: "Email Editor" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleSignOut() {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="admin-mobile-bar">
        <span className="admin-mobile-brand">Admin</span>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="admin-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </header>

      <aside className={`admin-sidebar${mobileOpen ? " is-open" : ""}`}>
        <Link href="/admin" className="admin-brand" onClick={() => setMobileOpen(false)}>
          Admin
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${isActive(item.href) ? " is-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="admin-signout"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </aside>
    </>
  );
}
