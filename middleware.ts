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
function configErrorResponse(): NextResponse {
  // Plain HTML, served from the Edge — no Supabase client needed. Renders
  // when SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY are missing on the
  // deployment so the visitor sees actionable instructions instead of a
  // generic 500 from the supabase-js init.
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin not configured</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #080808; color: #F0EBE3; margin: 0; padding: 3rem 1.5rem; min-height: 100vh; }
    main { max-width: 640px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #E05A0C; margin: 0 0 1rem; font-size: 1.6rem; }
    p { color: #B9B0A1; margin: 0 0 1rem; }
    ul { padding-left: 1.25rem; color: #F0EBE3; }
    code { background: #1a1a1a; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.95em; }
    .footnote { color: #5e5950; font-size: 0.85rem; margin-top: 2rem; }
  </style>
</head>
<body><main>
  <h1>Admin not configured</h1>
  <p>This deployment is missing the Supabase environment variables that the admin auth gate needs.</p>
  <p>Add the following on <strong>Vercel → Project Settings → Environment Variables</strong> (Production), then redeploy:</p>
  <ul>
    <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
    <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
    <li><code>SUPABASE_SERVICE_ROLE_KEY</code></li>
  </ul>
  <p class="footnote">If you're not the deployment owner, this isn't the page you were looking for. Try again later.</p>
</main></body>
</html>`;
  return new NextResponse(html, {
    status: 503,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Defensive: bail with an actionable message rather than crashing the
  // Supabase client constructor when env vars are missing.
  if (!SUPABASE_URL || !ANON_KEY) {
    return configErrorResponse();
  }

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
