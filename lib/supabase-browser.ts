"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser-side Supabase client. Used by the login form (signInWithPassword)
 * and any other client component that needs the authenticated session.
 */
export function getBrowserClient() {
  return createBrowserClient(SUPABASE_URL, ANON_KEY);
}
