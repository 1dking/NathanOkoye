/**
 * Browser-safe Supabase REST helper.
 *
 * Uses NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local.
 * Returns null if either is missing — pages that use this should fall back
 * gracefully so a misconfigured environment doesn't throw at runtime.
 */
export interface BrowserSupabase {
  url: string;
  anonKey: string;
}

export function getBrowserSupabase(): BrowserSupabase | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

/** Insert a single row into a Supabase table from the browser. */
export async function insertRow(
  table: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; error?: string }> {
  const sb = getBrowserSupabase();
  if (!sb) return { ok: false, status: 0, error: "Supabase env vars missing" };

  try {
    const res = await fetch(`${sb.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: sb.anonKey,
        Authorization: `Bearer ${sb.anonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: String(err) };
  }
}
