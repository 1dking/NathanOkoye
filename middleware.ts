import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const VALID_TIERS = ["low", "medium", "high"] as const;
type Tier = (typeof VALID_TIERS)[number];

function isValidTier(v: unknown): v is Tier {
  return typeof v === "string" && (VALID_TIERS as readonly string[]).includes(v);
}

async function lookupTier(visitorToken: string): Promise<Tier> {
  if (!SUPABASE_URL || !SERVICE_KEY) return "low";
  try {
    const url =
      `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/visitors` +
      `?visitor_token=eq.${encodeURIComponent(visitorToken)}` +
      `&select=intent_tier&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      // Hard 100ms cap per spec — rather default to low than block rendering.
      signal: AbortSignal.timeout(100),
    });
    if (!res.ok) return "low";
    const rows = (await res.json()) as Array<{ intent_tier?: string }>;
    const t = rows?.[0]?.intent_tier;
    return isValidTier(t) ? t : "low";
  } catch {
    return "low";
  }
}

export async function middleware(request: NextRequest) {
  const visitorToken = request.cookies.get("nate_visitor")?.value;
  const existingTier = request.cookies.get("nate_tier")?.value;

  let tier: Tier;
  if (visitorToken) {
    // Real visitor — always derive tier from DB so it stays in sync as
    // their behavioral score grows.
    tier = await lookupTier(visitorToken);
  } else if (isValidTier(existingTier)) {
    // No visitor token but a valid nate_tier cookie exists — preserve it.
    // Enables manual variant testing in DevTools without inserting test
    // visitors in the DB.
    tier = existingTier;
  } else {
    tier = "low";
  }

  // Forward the cookie to the page handler on the same request so the
  // server component renders the correct variant on first paint (no CLS).
  const requestHeaders = new Headers(request.headers);
  const existingCookieHeader = requestHeaders.get("cookie") ?? "";
  const cleaned = existingCookieHeader
    .replace(/(?:^|;\s*)nate_tier=[^;]*/g, "")
    .replace(/^;\s*/, "");
  const newCookieHeader = cleaned
    ? `${cleaned}; nate_tier=${tier}`
    : `nate_tier=${tier}`;
  requestHeaders.set("cookie", newCookieHeader);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist for subsequent navigations.
  response.cookies.set("nate_tier", tier, {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

export const config = {
  matcher: ["/", "/work-with-nathan"],
};
