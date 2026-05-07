-- =====================================================================
-- Phase 3 — Lead-scoring engine
--
-- Defines public.calculate_lead_score(visitor_token) used by:
--   1. The track-event Edge Function (via supabase.rpc) on every event
--   2. Future admin-dashboard "recalculate" actions
--
-- Scoring rules:
--   page_view          +1 each (uncapped)
--   /work-with-nathan  +8 once (detected via page_view on that path)
--   scroll_50          +2 per distinct page
--   scroll_90          +3 per distinct page
--   section_view       +1 per distinct section
--   case_study_open    +5 per distinct case study (by page)
--   time_on_page       +1 per tick, max +10
--   assessment_started   +10 once
--   assessment_completed +20 once
--   playbook_requested   +15 once
--   external_link_click  +15 once
--   booking_link_clicked +25 once
--   return_visit       +10 each, max 3 visits → +30
--   Final cap: 150
--
-- Tier breaks (computed in TypeScript, kept in sync here as docs):
--   0–20 = low, 21–50 = medium, 51+ = high
-- =====================================================================

CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_visitor_token text)
RETURNS integer
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_score int := 0;
BEGIN
  v_score := v_score + (
    SELECT COUNT(*) FROM behavioral_events
    WHERE visitor_token = p_visitor_token AND event_type = 'page_view'
  );

  IF EXISTS (
    SELECT 1 FROM behavioral_events
    WHERE visitor_token = p_visitor_token
      AND event_type = 'page_view'
      AND page = '/work-with-nathan'
  ) THEN
    v_score := v_score + 8;
  END IF;

  v_score := v_score + 2 * (
    SELECT COUNT(DISTINCT page) FROM behavioral_events
    WHERE visitor_token = p_visitor_token AND event_type = 'scroll_50'
  );

  v_score := v_score + 3 * (
    SELECT COUNT(DISTINCT page) FROM behavioral_events
    WHERE visitor_token = p_visitor_token AND event_type = 'scroll_90'
  );

  v_score := v_score + (
    SELECT COUNT(DISTINCT section) FROM behavioral_events
    WHERE visitor_token = p_visitor_token
      AND event_type = 'section_view'
      AND section IS NOT NULL
  );

  v_score := v_score + 5 * (
    SELECT COUNT(DISTINCT page) FROM behavioral_events
    WHERE visitor_token = p_visitor_token
      AND event_type = 'case_study_open'
  );

  v_score := v_score + LEAST((
    SELECT COUNT(*) FROM behavioral_events
    WHERE visitor_token = p_visitor_token AND event_type = 'time_on_page'
  ), 10);

  IF EXISTS (SELECT 1 FROM behavioral_events
             WHERE visitor_token = p_visitor_token AND event_type = 'assessment_started') THEN
    v_score := v_score + 10;
  END IF;
  IF EXISTS (SELECT 1 FROM behavioral_events
             WHERE visitor_token = p_visitor_token AND event_type = 'assessment_completed') THEN
    v_score := v_score + 20;
  END IF;
  IF EXISTS (SELECT 1 FROM behavioral_events
             WHERE visitor_token = p_visitor_token AND event_type = 'playbook_requested') THEN
    v_score := v_score + 15;
  END IF;
  IF EXISTS (SELECT 1 FROM behavioral_events
             WHERE visitor_token = p_visitor_token AND event_type = 'external_link_click') THEN
    v_score := v_score + 15;
  END IF;
  IF EXISTS (SELECT 1 FROM behavioral_events
             WHERE visitor_token = p_visitor_token AND event_type = 'booking_link_clicked') THEN
    v_score := v_score + 25;
  END IF;

  v_score := v_score + 10 * LEAST((
    SELECT COUNT(*) FROM behavioral_events
    WHERE visitor_token = p_visitor_token AND event_type = 'return_visit'
  ), 3);

  RETURN LEAST(v_score, 150);
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_lead_score(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_lead_score(text) TO service_role;
