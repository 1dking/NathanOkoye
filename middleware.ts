import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ADMIN_EMAIL = "info@nathanokoye.com";

const VALID_TIERS = ["low", "medium", "high"] as const;
type Tier = (typeof VALID_TIERS)[number];

function isValidTier(v: unknown): v is Tier {
  return typeof v === "string" && (VALID_TIERS as readonly string[]).includes(v);
}

/* ---------- Phase 4: GXO personalisation tier resolver ---------- */
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

async function handlePersonalisation(request: NextRequest): Promise<NextResponse> {
  const visitorToken = request.cookies.get("nate_visitor")?.value;
  const existingTier = request.cookies.get("nate_tier")?.value;

  let tier: Tier;
  if (visitorToken) {
    tier = await lookupTier(visitorToken);
  } else if (isValidTier(existingTier)) {
    tier = existingTier;
  } else {
    tier = "low";
  }

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
  response.cookies.set("nate_tier", tier, {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

/* ---------- Phase 5: Admin auth gate ---------- */
async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Build a response we'll mutate as Supabase refreshes auth cookies.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";
  const isAuthorized = user?.email === ADMIN_EMAIL;

  if (!isAuthorized && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthorized && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }
  if (pathname === "/" || pathname === "/work-with-nathan") {
    return handlePersonalisation(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/work-with-nathan", "/admin/:path*"],
};
