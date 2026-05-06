-- =====================================================================
-- Nathan Okoye — Phase 1 core backend schema
-- Run this in Supabase SQL Editor (project: hfioxbfdcbqsuxgvsogy)
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Table 1 · visitors
-- ---------------------------------------------------------------------
create table if not exists public.visitors (
  id              uuid primary key default gen_random_uuid(),
  visitor_token   text unique not null,
  first_seen_at   timestamptz default now(),
  last_seen_at    timestamptz default now(),
  visit_count     integer default 1,
  device          text,
  country         text,
  lead_score      integer default 0,
  intent_tier     text default 'low',
  converted       boolean default false,
  converted_at    timestamptz
);

-- ---------------------------------------------------------------------
-- Table 2 · behavioral_events
-- ---------------------------------------------------------------------
create table if not exists public.behavioral_events (
  id             uuid primary key default gen_random_uuid(),
  visitor_token  text not null,
  event_type     text not null,
  page           text not null,
  section        text,
  value          integer,
  metadata       jsonb,
  created_at     timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Table 3 · assessment_submissions
-- ---------------------------------------------------------------------
create table if not exists public.assessment_submissions (
  id                            uuid primary key default gen_random_uuid(),
  visitor_token                 text references public.visitors(visitor_token),
  first_name                    text not null,
  email                         text not null,
  total_score                   integer not null,
  result_tier                   text not null,
  score_distinctiveness         integer,
  score_recognition             integer,
  score_energy                  integer,
  score_business_impact         integer,
  score_authentic_expression    integer,
  statement_1                   integer,
  statement_2                   integer,
  statement_3                   integer,
  statement_4                   integer,
  statement_5                   integer,
  statement_6                   integer,
  statement_7                   integer,
  statement_8                   integer,
  statement_9                   integer,
  statement_10                  integer,
  sequence_enrolled             boolean default false,
  submitted_at                  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Table 4 · playbook_requests
-- ---------------------------------------------------------------------
create table if not exists public.playbook_requests (
  id                  uuid primary key default gen_random_uuid(),
  visitor_token       text references public.visitors(visitor_token),
  first_name          text not null,
  email               text not null,
  requested_at        timestamptz default now(),
  sequence_enrolled   boolean default false
);

-- ---------------------------------------------------------------------
-- Table 5 · sequence_enrollments
-- ---------------------------------------------------------------------
create table if not exists public.sequence_enrollments (
  id                       uuid primary key default gen_random_uuid(),
  submission_id            uuid references public.assessment_submissions(id) on delete cascade,
  playbook_request_id      uuid references public.playbook_requests(id) on delete cascade,
  email                    text not null,
  first_name               text not null,
  sequence_type            text not null,
  tier                     text,
  total_score              integer,
  current_step             integer default 0,
  next_send_at             timestamptz not null,
  completed                boolean default false,
  unsubscribed             boolean default false,
  enrolled_at              timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Table 6 · email_logs
-- ---------------------------------------------------------------------
create table if not exists public.email_logs (
  id              uuid primary key default gen_random_uuid(),
  enrollment_id   uuid references public.sequence_enrollments(id) on delete set null,
  email           text not null,
  subject         text not null,
  step            integer not null,
  sent_at         timestamptz default now(),
  status          text default 'sent',
  error           text
);

-- ---------------------------------------------------------------------
-- Table 7 · crm_leads
-- ---------------------------------------------------------------------
create table if not exists public.crm_leads (
  id                            uuid primary key default gen_random_uuid(),
  visitor_token                 text references public.visitors(visitor_token),
  first_name                    text,
  email                         text unique not null,
  lead_score                    integer default 0,
  intent_tier                   text default 'low',
  assessment_score              integer,
  assessment_tier               text,
  status                        text default 'lead',
  notes                         text,
  discovery_session_booked      boolean default false,
  discovery_session_date        timestamptz,
  is_client                     boolean default false,
  created_at                    timestamptz default now(),
  updated_at                    timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Table 8 · admin_users
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  password_hash   text not null,
  created_at      timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Indexes for common access patterns
-- ---------------------------------------------------------------------
create index if not exists idx_behavioral_events_visitor    on public.behavioral_events(visitor_token);
create index if not exists idx_behavioral_events_created    on public.behavioral_events(created_at desc);
create index if not exists idx_visitors_token               on public.visitors(visitor_token);
create index if not exists idx_assessment_submissions_email on public.assessment_submissions(email);
create index if not exists idx_playbook_requests_email      on public.playbook_requests(email);
create index if not exists idx_sequence_enrollments_due
  on public.sequence_enrollments(next_send_at)
  where completed = false and unsubscribed = false;
create index if not exists idx_crm_leads_email              on public.crm_leads(email);
create index if not exists idx_email_logs_enrollment        on public.email_logs(enrollment_id);

-- ---------------------------------------------------------------------
-- Auto-touch updated_at on crm_leads
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_crm_leads_updated_at on public.crm_leads;
create trigger trg_crm_leads_updated_at
  before update on public.crm_leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
--   Service role bypasses RLS automatically (used by Edge Functions).
--   Anon role: insert-only on the three forms tables.
-- ---------------------------------------------------------------------
alter table public.visitors                enable row level security;
alter table public.behavioral_events       enable row level security;
alter table public.assessment_submissions  enable row level security;
alter table public.playbook_requests       enable row level security;
alter table public.sequence_enrollments    enable row level security;
alter table public.email_logs              enable row level security;
alter table public.crm_leads               enable row level security;
alter table public.admin_users             enable row level security;

-- Drop any pre-existing duplicate policies to keep this idempotent
drop policy if exists "anon insert behavioral events"     on public.behavioral_events;
drop policy if exists "anon insert assessment"            on public.assessment_submissions;
drop policy if exists "anon insert playbook"              on public.playbook_requests;

create policy "anon insert behavioral events"
  on public.behavioral_events
  for insert
  to anon, authenticated
  with check (true);

create policy "anon insert assessment"
  on public.assessment_submissions
  for insert
  to anon, authenticated
  with check (true);

create policy "anon insert playbook"
  on public.playbook_requests
  for insert
  to anon, authenticated
  with check (true);

-- All other tables remain locked to the service role only by default.
-- Edge Functions invoked with the service role key bypass RLS entirely.
