/**
 * Tier breaks for the lead-scoring engine.
 *
 * The score itself is computed by the public.calculate_lead_score(text)
 * Postgres function — see supabase/migrations/ for the canonical rules.
 * Keeping the tier mapping in TypeScript so callers can label a score
 * without an extra round trip to Postgres.
 */
export function tierFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 51) return "high";
  if (score >= 21) return "medium";
  return "low";
}
