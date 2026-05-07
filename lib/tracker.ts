"use client";

import { getOrCreateVisitorToken } from "@/lib/visitor";
import { getBrowserSupabase } from "@/lib/supabase";

const SCORE_KEY = "nate_score";
const TIER_KEY = "nate_tier";

const isDev = process.env.NODE_ENV !== "production";

export interface TrackOptions {
  page?: string;
  section?: string | null;
  value?: number | null;
  metadata?: Record<string, unknown> | null;
}

interface TrackResponse {
  visitor_token?: string;
  lead_score?: number;
  intent_tier?: string;
}

/**
 * Fire-and-forget event POST. Never throws, never blocks rendering.
 * Stores returned lead_score and intent_tier in localStorage for the
 * Phase 4 personalisation layer.
 */
export function track(eventType: string, opts: TrackOptions = {}): void {
  if (typeof window === "undefined") return;

  const sb = getBrowserSupabase();
  if (!sb) {
    if (isDev) console.warn("[tracker] Supabase env missing; skipping", eventType);
    return;
  }

  const payload = {
    visitor_token: getOrCreateVisitorToken(),
    event_type: eventType,
    page: opts.page ?? window.location.pathname,
    section: opts.section ?? null,
    value: opts.value ?? null,
    metadata: opts.metadata ?? null,
  };

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[tracker]", eventType, payload);
  }

  fetch(`${sb.url}/functions/v1/track-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sb.anonKey}`,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then(async (res) => {
      if (!res.ok) {
        if (isDev) console.warn("[tracker] non-OK", res.status, eventType);
        return;
      }
      try {
        const data = (await res.json()) as TrackResponse;
        if (typeof data.lead_score === "number") {
          window.localStorage.setItem(SCORE_KEY, String(data.lead_score));
        }
        if (typeof data.intent_tier === "string") {
          window.localStorage.setItem(TIER_KEY, data.intent_tier);
        }
      } catch {
        // body shape unexpected — skip silently
      }
    })
    .catch((err) => {
      if (isDev) console.warn("[tracker] fetch failed", eventType, err);
      // never surface to user
    });
}

export function getStoredScore(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SCORE_KEY);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function getStoredTier(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TIER_KEY);
  } catch {
    return null;
  }
}
