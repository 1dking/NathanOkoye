#!/usr/bin/env python3
"""
Generates supabase/migrations/20260506_phase_1_core.sql from a single-source
definition of the schema + email templates.

Run:
    python supabase/scripts/build_phase_1.py

Outputs:
    supabase/migrations/20260506_phase_1_core.sql
"""

from __future__ import annotations

import os
import textwrap
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "migrations" / "20260506_phase_1_core.sql"

# =====================================================================
# Schema portion — 9 tables, indexes, RLS, trigger
# =====================================================================

SCHEMA_SQL = r"""-- =====================================================================
-- Nathan Okoye — Phase 1 core backend (generated)
-- Run in Supabase SQL Editor (project: hfioxbfdcbqsuxgvsogy)
-- Idempotent: every create is `if not exists`; seed data is reset before
-- re-insert so re-running this file is safe.
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
-- Table 7 · email_templates  (NEW — editable by admin)
-- ---------------------------------------------------------------------
create table if not exists public.email_templates (
  id              uuid primary key default gen_random_uuid(),
  sequence_type   text not null,
  tier            text,
  step            integer not null,
  subject         text not null,
  body_html       text not null,
  delay_days      integer not null default 0,
  active          boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- One active template per (sequence_type, step). Tier left in for admin
-- display; the lookup uses sequence_type + step.
create unique index if not exists uniq_email_templates_active
  on public.email_templates(sequence_type, step)
  where active = true;

-- ---------------------------------------------------------------------
-- Table 8 · crm_leads
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
-- Table 9 · admin_users
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  password_hash   text not null,
  created_at      timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Indexes
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
create index if not exists idx_email_templates_lookup       on public.email_templates(sequence_type, step) where active = true;

-- ---------------------------------------------------------------------
-- updated_at trigger (re-used by crm_leads + email_templates)
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $set_updated_at$
begin
  new.updated_at := now();
  return new;
end $set_updated_at$;

drop trigger if exists trg_crm_leads_updated_at on public.crm_leads;
create trigger trg_crm_leads_updated_at
  before update on public.crm_leads
  for each row execute function public.set_updated_at();

drop trigger if exists trg_email_templates_updated_at on public.email_templates;
create trigger trg_email_templates_updated_at
  before update on public.email_templates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS — service role bypasses; anon role can INSERT to the three
-- public form tables only.
-- ---------------------------------------------------------------------
alter table public.visitors                enable row level security;
alter table public.behavioral_events       enable row level security;
alter table public.assessment_submissions  enable row level security;
alter table public.playbook_requests       enable row level security;
alter table public.sequence_enrollments    enable row level security;
alter table public.email_logs              enable row level security;
alter table public.email_templates         enable row level security;
alter table public.crm_leads               enable row level security;
alter table public.admin_users             enable row level security;

drop policy if exists "anon insert behavioral events" on public.behavioral_events;
drop policy if exists "anon insert assessment"        on public.assessment_submissions;
drop policy if exists "anon insert playbook"          on public.playbook_requests;

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

"""

# =====================================================================
# Email-template seed — one source of truth for body content.
# Wrapper provides the dark-themed shell; each email's BODY varies.
# Placeholders: {{first_name}} {{score}} {{unsubscribe_url}}
# =====================================================================

SITE = "https://nathanokoye.com"

def WRAPPER(body_html: str, title: str, preheader: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#080808;color:#F0EBE3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
{('<div style="display:none;max-height:0;overflow:hidden;color:#080808;">' + preheader + '</div>') if preheader else ''}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#080808;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
<tr><td style="padding:0 0 24px;">
<p style="margin:0;font-family:Georgia,'Iowan Old Style',serif;font-size:18px;letter-spacing:0.04em;color:#F0EBE3;">Nathan Okoye <span style="color:rgba(240,235,227,0.62);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;margin-left:8px;">Brand Strategist</span></p>
</td></tr>
<tr><td style="font-size:16px;line-height:1.65;color:#F0EBE3;">
{body_html}
</td></tr>
<tr><td style="padding:36px 0 0;border-top:1px solid rgba(240,235,227,0.14);font-size:12px;line-height:1.6;color:rgba(240,235,227,0.62);">
<p style="margin:0 0 6px;">Nathan Okoye · Brand Strategist · Toronto, Canada</p>
<p style="margin:0;">
<a href="{{{{unsubscribe_url}}}}" style="color:rgba(240,235,227,0.62);text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp; <a href="{SITE}" style="color:rgba(240,235,227,0.62);text-decoration:underline;">nathanokoye.com</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>"""

def cta(label: str, href: str) -> str:
    return f"""<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
<tr><td bgcolor="#E05A0C" style="border-radius:999px;">
<a href="{href}" style="display:inline-block;padding:14px 28px;color:#F0EBE3;background:#E05A0C;text-decoration:none;font-weight:600;border-radius:999px;letter-spacing:0.02em;">{label}</a>
</td></tr></table>"""

def score_callout(label: str) -> str:
    return f"""<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;border:1px solid rgba(240,235,227,0.14);border-radius:6px;width:100%;">
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(240,235,227,0.62);">Your score</p>
<p style="margin:0;font-family:Georgia,serif;font-size:32px;line-height:1;color:#F0EBE3;">{{{{score}}}}<span style="font-size:14px;color:rgba(240,235,227,0.62);margin-left:6px;">/ 50</span></p>
<p style="margin:8px 0 0;font-size:13px;color:rgba(240,235,227,0.62);">{label}</p>
</td></tr></table>"""

def tier_badge(label: str) -> str:
    return f'<p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;color:#E05A0C;">[ {label} ]</p>'

def h1(t: str) -> str:
    return f'<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;line-height:1.2;letter-spacing:-0.01em;font-weight:400;color:#F0EBE3;">{t}</h1>'

def p(t: str) -> str:
    return f'<p style="margin:0 0 16px;color:#F0EBE3;">{t}</p>'

def p_soft(t: str) -> str:
    return f'<p style="margin:0 0 16px;color:rgba(240,235,227,0.78);">{t}</p>'

def focus_label() -> str:
    return '<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E05A0C;">Your focus</p>'

GREETING = '<p style="margin:0 0 16px;color:#F0EBE3;">Hi {{first_name}},</p>'
SIGNOFF  = '<p style="margin:24px 0 0;color:#F0EBE3;">— Nathan</p>'

# ---------------------------------------------------------------------
# Tier copy (used in the Step 0 result emails)
# ---------------------------------------------------------------------
TIER = {
    "generic-content": {
        "label": "Generic Content",
        "headline": "Your brand is not yet working for you.",
        "description": "Content exists, but it is not creating distinction, recognition, or pipeline movement. This is not a reflection of the quality of your work. It is a reflection of how your brand is currently representing it. The gap between your actual expertise and your public presence is significant — and that gap is the source of every slow referral, every price objection, and every prospect who seemed interested and then went quiet.",
        "focus": "Identity before everything. Nothing built on an unclear foundation will compound. The CORE framework starts with one question — who are you to the people you serve, and does anything you are currently putting into the world reflect that accurately?",
        "cta_label": "Book The CORE Discovery Session →",
        "cta_href": f"{SITE}/work-with-nathan",
    },
    "following-templates": {
        "label": "Following Templates",
        "headline": "You are saying the right things in the wrong way.",
        "description": "Your brand is functional but forgettable. You are using the language of your category instead of the language that is uniquely yours. Prospects who find you understand what you do, but they cannot feel why you are the right person to do it for them.",
        "focus": "Distinctiveness first, then Organic Reach. Before systems, before ads, before consistency — the foundation needs to be set. What makes you genuinely different must be identified and articulated before anything else is built.",
        "cta_label": "Book The CORE Discovery Session →",
        "cta_href": f"{SITE}/work-with-nathan",
    },
    "authentic-but-unfocused": {
        "label": "Authentic but Unfocused",
        "headline": "The raw material is there. The precision is not.",
        "description": "You have genuine expertise, a real point of view, and enough presence that the right people find you. What is missing is the sharpness that makes the right person stop and say — this is exactly what I have been looking for. You are reaching people, but not reliably converting that reach into the right conversations.",
        "focus": "Distinctiveness and Authentic Expression. Your content needs to speak your client's language more precisely than it currently does. The gap is in translation, not in substance.",
        "cta_label": "Book The CORE Discovery Session →",
        "cta_href": f"{SITE}/work-with-nathan",
    },
    "strategically-authentic": {
        "label": "Strategically Authentic",
        "headline": "Your brand is working. The gap is narrow.",
        "description": "The alignment between who you are and how your brand represents you is generating real results. The foundation is solid. The work now is not repair — it is compounding. Sharper systems, wider reach, and a structured engagement strategy that moves your audience from attention to action.",
        "focus": "Repeatable Systems and Engagement Strategy. You have the identity and the organic reach. Build the infrastructure that makes it consistent at scale and converts attention into conversations.",
        "cta_label": "See how the CORE framework compounds what you have already built →",
        "cta_href": f"{SITE}/core-framework",
    },
}

def step0_body(tier_key: str) -> str:
    t = TIER[tier_key]
    return "\n".join([
        GREETING,
        score_callout(t["label"]),
        tier_badge(t["label"]),
        h1(t["headline"]),
        p_soft(t["description"]),
        focus_label(),
        p_soft(t["focus"]),
        cta(t["cta_label"], t["cta_href"]),
        SIGNOFF,
    ])

# ---------------------------------------------------------------------
# Each entry: (sequence_type, tier, step, subject, body, delay_days,
#              title, preheader)
# ---------------------------------------------------------------------
EMAILS = []

# === GENERIC CONTENT ===
EMAILS.append(("generic-content", "generic-content", 0,
    "Your Strategic Authenticity Assessment Result [ Generic Content ]",
    step0_body("generic-content"), 0,
    "Your result · Generic Content",
    "Score: {{score}} / 50 · Generic Content"))

EMAILS.append(("generic-content", "generic-content", 1,
    "The gap between your expertise and your brand",
    "\n".join([
        GREETING,
        p("A senior philanthropic advisor came to me with a brand that communicated none of her expertise. The track record was real. The credibility in her network was real. The public-facing presence was not. Within six months of rebuilding the positioning, she acquired a philanthropic advisory engagement worth over $75 million — not from a campaign, not from outreach, from being seen clearly for the first time."),
        p_soft(f'The full story is here: <a href="{SITE}/case-study-advisor" style="color:#E05A0C;">Read the case study</a>.'),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    3, "The gap", "Cheryl Hudson — what changed when the brand finally matched the work."))

EMAILS.append(("generic-content", "generic-content", 2,
    "What closing the gap actually looks like",
    "\n".join([
        GREETING,
        p("A performing arts organisation hadn't sold out an event in 15 years. The product hadn't declined — the conversation around it had. Two months of repositioned content and structured performance marketing later, the event sold out for the first time in over a decade. Same product, new precision."),
        p_soft(f'<a href="{SITE}/case-study-arts" style="color:#E05A0C;">Read the full case study</a>.'),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    7, "Closing the gap",
    "Sold out for the first time in 15 years — only the conversation changed."))

EMAILS.append(("generic-content", "generic-content", 3,
    "One conversation changes everything",
    "\n".join([
        GREETING,
        p("Your assessment score tells me exactly where the gap is. The Discovery Session closes it. If you are ready — the link is below."),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    14, "One conversation",
    "Your assessment score told me where the gap is. The Discovery Session closes it."))

# === FOLLOWING TEMPLATES ===
EMAILS.append(("following-templates", "following-templates", 0,
    "Your Strategic Authenticity Assessment Result [ Following Templates ]",
    step0_body("following-templates"), 0,
    "Your result · Following Templates",
    "Score: {{score}} / 50 · Following Templates"))

EMAILS.append(("following-templates", "following-templates", 1,
    "What happens when the foundation is set first",
    "\n".join([
        GREETING,
        p("A founder building a civic institution in partnership with a municipal government had a vision but no brand. We built positioning, platform, and content from the ground up — foundation first, then everything else. Fifteen thousand people showed up to an event with no prior history, no established audience, and no brand equity the week before we started. That is what happens when the foundation is set first."),
        p_soft(f'<a href="{SITE}/case-study-institution" style="color:#E05A0C;">Read the case study</a>.'),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    3, "Foundation first",
    "Caribana Ignite — 15,000 attendees from a brand built from nothing."))

EMAILS.append(("following-templates", "following-templates", 2,
    "The CORE framework — built from experience",
    "\n".join([
        GREETING,
        p("CORE is four layers. Each one builds on the one before it."),
        '<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">C — Creative Authenticity.</strong> Content that only you could make, not the language of your category.</p>',
        '<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">O — Organic Reach.</strong> The right positioning makes the right audience self-select.</p>',
        '<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">R — Repeatable Systems.</strong> Two-hour content production that compounds, not exhausts.</p>',
        '<p style="margin:0 0 16px;color:#F0EBE3;"><strong style="color:#E05A0C;">E — Engagement Strategy.</strong> Audience to client base, through structured conversation.</p>',
        p_soft(f'<a href="{SITE}/core-framework" style="color:#E05A0C;">Read the full framework</a>.'),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    7, "The CORE framework",
    "Four layers — Creative Authenticity, Organic Reach, Repeatable Systems, Engagement Strategy."))

EMAILS.append(("following-templates", "following-templates", 3,
    "The first step is always the same",
    "\n".join([
        GREETING,
        p("Your assessment score tells me exactly where the gap is. The Discovery Session closes it. If you are ready — the link is below."),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    14, "The first step",
    "Your score points to where the foundation needs to be set."))

# === AUTHENTIC BUT UNFOCUSED ===
EMAILS.append(("authentic-but-unfocused", "authentic-but-unfocused", 0,
    "Your Strategic Authenticity Assessment Result [ Authentic but Unfocused ]",
    step0_body("authentic-but-unfocused"), 0,
    "Your result · Authentic but Unfocused",
    "Score: {{score}} / 50 · Authentic but Unfocused"))

EMAILS.append(("authentic-but-unfocused", "authentic-but-unfocused", 1,
    "When the raw material is there but the precision is not",
    "\n".join([
        GREETING,
        p("A subject-matter expert had a product the market celebrated but did not buy. Schools wanted to support the work — they didn't know how to implement it. The product read as a passion project, not a system. The repositioning reframed it as an institutional system, directed at the buyers with the authority and budget to adopt it. $39,378 in online revenue followed within the campaign window. Same product, sharper positioning."),
        p_soft(f'<a href="{SITE}/case-study-publisher" style="color:#E05A0C;">Read the case study</a>.'),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    5, "Raw material vs precision",
    "$39,378 followed when the same product was finally positioned right."))

EMAILS.append(("authentic-but-unfocused", "authentic-but-unfocused", 2,
    "The Discovery Session finds exactly where the translation breaks down",
    "\n".join([
        GREETING,
        p("You have the expertise. The CORE Discovery Session identifies precisely where the language is losing people before they become clients."),
        cta("Book The CORE Discovery Session →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    14, "Where translation breaks down",
    "You have the expertise. The Discovery Session pinpoints where the language is losing people."))

# === STRATEGICALLY AUTHENTIC ===
EMAILS.append(("strategically-authentic", "strategically-authentic", 0,
    "Your Strategic Authenticity Assessment Result [ Strategically Authentic ]",
    step0_body("strategically-authentic"), 0,
    "Your result · Strategically Authentic",
    "Score: {{score}} / 50 · Strategically Authentic"))

EMAILS.append(("strategically-authentic", "strategically-authentic", 1,
    "The next layer — systems and engagement",
    "\n".join([
        GREETING,
        p("A strong foundation means the next work is compounding it — repeatable systems and an engagement strategy that converts attention into clients. That is what the CORE Brand Build is built to do."),
        cta("Explore working together →", f"{SITE}/work-with-nathan"),
        SIGNOFF,
    ]),
    7, "Systems and engagement",
    "A strong foundation means the next work is compounding."))

# === PLAYBOOK ===
EMAILS.append(("playbook", None, 0,
    "Your Visibility Playbook is on its way",
    "\n".join([
        GREETING,
        p("Thank you — your Visibility Playbook is on its way and will arrive shortly."),
        p("While you wait: the fastest way to know exactly where your brand gap is sitting right now is the Strategic Authenticity Assessment. Ten statements, five minutes, a personalised tier result with focus areas pulled from your specific answers."),
        cta("Take the Assessment →", f"{SITE}/assessment"),
        SIGNOFF,
    ]),
    0, "Playbook on its way",
    "A practical guide for consultants, coaches, and advisors done posting into the void."))

EMAILS.append(("playbook", None, 1,
    "The four post types — and why most consultants only use two",
    "\n".join([
        GREETING,
        p("Most consultants post two of the four types — informative posts and credibility posts. They miss the two that actually move expertise into authority: the contrarian read and the decision frame. That is why content keeps performing without converting."),
        p("The Visibility Playbook walks through all four with worked examples. While you wait for it, the assessment will tell you which of the four you are leaning on most heavily."),
        cta("Take the Assessment →", f"{SITE}/assessment"),
        SIGNOFF,
    ]),
    3, "Four post types",
    "Point-of-view, pattern recognition, contrarian read, decision frame."))

# =====================================================================
# Render seed SQL
# =====================================================================

def sql_quote(s: str) -> str:
    """Postgres dollar-quoted string — avoids escaping pain on HTML."""
    return f"$tpl${s}$tpl$"

def sql_text(s):
    if s is None:
        return "null"
    return "$tpl$" + s + "$tpl$"

def render_seed() -> str:
    out = [
        "-- ---------------------------------------------------------------------",
        "-- Seed: email_templates",
        "-- Wipe-and-reseed for the five sequences so re-runs converge.",
        "-- ---------------------------------------------------------------------",
        "delete from public.email_templates",
        "  where sequence_type in ('generic-content','following-templates','authentic-but-unfocused','strategically-authentic','playbook');",
        "",
    ]
    for (seq, tier, step, subject, body_html, delay_days, title, preheader) in EMAILS:
        full_html = WRAPPER(body_html, title, preheader)
        out.append("insert into public.email_templates (sequence_type, tier, step, subject, body_html, delay_days) values (")
        out.append(f"  {sql_text(seq)},")
        out.append(f"  {sql_text(tier)},")
        out.append(f"  {step},")
        out.append(f"  {sql_text(subject)},")
        out.append(f"  {sql_text(full_html)},")
        out.append(f"  {delay_days}")
        out.append(");")
        out.append("")
    return "\n".join(out)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    full_sql = SCHEMA_SQL + "\n" + render_seed()
    OUT.write_text(full_sql, encoding="utf-8")
    size_kb = len(full_sql) / 1024
    print(f"wrote {OUT}  ({size_kb:.1f} KB, {len(EMAILS)} email templates)")

if __name__ == "__main__":
    main()
