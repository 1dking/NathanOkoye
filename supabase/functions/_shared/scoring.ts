/** Per-event lead-score weights. */
export const EVENT_SCORES: Record<string, number> = {
  page_view: 1,
  scroll_50: 2,
  scroll_90: 3,
  case_study_open: 5,
  work_with_nathan_visit: 8,
  assessment_started: 10,
  assessment_completed: 20,
  playbook_requested: 15,
  booking_clicked: 25,
};

export function tierFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 51) return "high";
  if (score >= 21) return "medium";
  return "low";
}
