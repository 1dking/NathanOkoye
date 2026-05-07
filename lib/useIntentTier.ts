"use client";

import { useEffect, useState } from "react";

export type IntentTier = "low" | "medium" | "high";

function readTierCookie(): IntentTier {
  if (typeof document === "undefined") return "low";
  const match = document.cookie.match(/(?:^|;\s*)nate_tier=([^;]+)/);
  if (!match) return "low";
  const v = decodeURIComponent(match[1]).toLowerCase();
  if (v === "medium" || v === "high") return v;
  return "low";
}

/**
 * Reads the `nate_tier` cookie set by middleware on / and /work-with-nathan.
 * Defaults to 'low' during SSR or if the cookie is missing.
 *
 * For SSR-safe variant rendering (CLS-free), prefer reading the cookie
 * directly in a server component via `cookies()` from `next/headers`.
 * This hook is for client subcomponents.
 */
export function useIntentTier(): IntentTier {
  const [tier, setTier] = useState<IntentTier>("low");
  useEffect(() => {
    setTier(readTierCookie());
  }, []);
  return tier;
}
