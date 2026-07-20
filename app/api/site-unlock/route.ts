import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "";
const SITE_ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN ?? "";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const redirectTo = safeRedirectPath(String(form.get("redirect") ?? "/"));

  const url = request.nextUrl.clone();

  const correct =
    Boolean(SITE_PASSWORD) && Boolean(SITE_ACCESS_TOKEN) && password === SITE_PASSWORD;

  if (!correct) {
    url.pathname = "/site-locked";
    const params = new URLSearchParams();
    if (redirectTo !== "/") params.set("redirect", redirectTo);
    params.set("error", "1");
    url.search = params.toString();
    return NextResponse.redirect(url);
  }

  url.pathname = redirectTo;
  url.search = "";
  const response = NextResponse.redirect(url);
  response.cookies.set("site_ok", SITE_ACCESS_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
