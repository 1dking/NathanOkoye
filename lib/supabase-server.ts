import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Server-side Supabase client wired to the Next.js cookie store. Use this in
 * server components, server actions, and route handlers when you need the
 * authenticated session (e.g. checking whether the admin is logged in).
 */
export function getServerClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // set() can throw inside server components when called outside an
          // action/route — safe to ignore; the middleware refreshes tokens.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // see above
        }
      },
    },
  });
}

/**
 * Service-role client for privileged data access from server contexts.
 * Bypasses RLS. Never expose this client (or the key) to the browser.
 */
export function getServiceClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
