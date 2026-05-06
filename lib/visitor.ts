/**
 * Browser-side visitor token. Persisted in localStorage so we can stitch
 * behavioural events to form submissions for the same person across pages.
 *
 * Generated with crypto.randomUUID() (or a fallback) — server never sees the
 * device, and the token is never tied to PII unless they submit a form.
 */

const STORAGE_KEY = "no_visitor_token";

export function getOrCreateVisitorToken(): string {
  if (typeof window === "undefined") {
    // SSR — return a placeholder so calls don't crash. Each browser
    // hydration replaces this with a real persisted token.
    return "ssr";
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const token = newToken();
    window.localStorage.setItem(STORAGE_KEY, token);
    return token;
  } catch {
    // localStorage blocked / quota / private browsing — degrade quietly.
    return newToken();
  }
}

function newToken(): string {
  const c = (typeof window !== "undefined" ? window.crypto : undefined) as
    | Crypto
    | undefined;
  if (c?.randomUUID) return c.randomUUID();
  // Fallback for very old browsers.
  return (
    "x-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}
