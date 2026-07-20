"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BGL_PASSWORD = process.env.BGL_PASSWORD ?? "";
const BGL_ACCESS_TOKEN = process.env.BGL_ACCESS_TOKEN ?? "";

export async function unlockBgl(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");

  if (!BGL_PASSWORD || !BGL_ACCESS_TOKEN || password !== BGL_PASSWORD) {
    redirect("/bgl?error=1");
  }

  cookies().set("bgl_ok", BGL_ACCESS_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/bgl",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/bgl");
}
