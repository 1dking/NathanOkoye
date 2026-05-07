// Plain TS types and constants shared between server pages and client
// components. No imports from next/headers or supabase server clients,
// so it's safe to import from "use client" files.

export interface Lead {
  id: string;
  first_name: string | null;
  email: string;
  lead_score: number | null;
  intent_tier: string | null;
  assessment_tier: string | null;
  status: string | null;
  discovery_session_booked: boolean | null;
  discovery_session_date: string | null;
  is_client: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Enrollment {
  id: string;
  email: string;
  first_name: string | null;
  sequence_type: string;
  tier: string | null;
  current_step: number;
  next_send_at: string | null;
  completed: boolean;
  unsubscribed: boolean;
  enrolled_at: string;
}

export const SEQUENCE_LENGTHS: Record<string, number> = {
  "generic-content": 4,
  "following-templates": 4,
  "authentic-but-unfocused": 3,
  "strategically-authentic": 2,
  playbook: 2,
};

export interface EmailLogRow {
  id: string;
  email: string;
  subject: string | null;
  step: number | null;
  status: string | null;
  sent_at: string | null;
  error: string | null;
  enrollment_id: string | null;
}

export interface EmailTemplate {
  id: string;
  sequence_type: string;
  tier: string | null;
  step: number;
  subject: string;
  body_html: string;
  delay_days: number;
  active: boolean;
  updated_at: string | null;
}
