# Nathan Okoye — Supabase backend (Phase 1)

Project ref: `hfioxbfdcbqsuxgvsogy` ·
URL: `https://hfioxbfdcbqsuxgvsogy.supabase.co`

```
supabase/
├── migrations/
│   └── 20260506_phase_1_core.sql       # 9 tables + 15 seeded email_templates
├── scripts/
│   └── build_phase_1.py                # regenerates the migration above
├── functions/
│   ├── _shared/
│   │   ├── cors.ts
│   │   ├── supabase.ts                 # service-role client factory
│   │   ├── smtp.ts                     # npm:nodemailer
│   │   ├── templates.ts                # fetch template from DB + apply vars
│   │   └── scoring.ts                  # lead-score weights
│   ├── track-event/                    # POST /functions/v1/track-event
│   ├── on-assessment-submit/           # webhook target
│   ├── on-playbook-request/            # webhook target
│   ├── process-sequences/              # cron target
│   └── unsubscribe/                    # GET /functions/v1/unsubscribe?token=…
└── README.md
```

## 1. Run the migration

Dashboard → SQL Editor → New query → paste
[`migrations/20260506_phase_1_core.sql`](./migrations/20260506_phase_1_core.sql)
→ Run.

The file is idempotent (`if not exists` everywhere; the seed deletes
sequence rows before re-inserting). Re-run is safe.

## 2. Set Edge Function secrets

```bash
supabase login
supabase link --project-ref hfioxbfdcbqsuxgvsogy

supabase secrets set \
  SMTP_HOST="mail.nathanokoye.com" \
  SMTP_PORT="465" \
  SMTP_USER="info@nathanokoye.com" \
  SMTP_PASS="<<your-smtp-password>>" \
  SMTP_FROM_NAME="Nathan Okoye"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected.

## 3. Deploy each function

```bash
supabase functions deploy track-event
supabase functions deploy on-assessment-submit
supabase functions deploy on-playbook-request
supabase functions deploy process-sequences
supabase functions deploy unsubscribe
```

The functions use `npm:nodemailer@6.9.13`. Supabase's runtime resolves
`npm:` specifiers automatically — no extra config.

## 4. Wire the database webhooks

Dashboard → Database → Webhooks:

| Hook | Source | Events | URL |
|---|---|---|---|
| `on-assessment-submit` | `public.assessment_submissions` | INSERT | `https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/on-assessment-submit` |
| `on-playbook-request` | `public.playbook_requests` | INSERT | `https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/on-playbook-request` |

Both need the header
`Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`.

## 5. Schedule the cron

Dashboard → Database → Cron Jobs → New (requires `pg_net` extension):

- Schedule: `0 * * * *`  (hourly)
- Command:

```sql
select net.http_post(
  url     := 'https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/process-sequences',
  headers := jsonb_build_object(
    'Content-Type',  'application/json',
    'Authorization', 'Bearer <SUPABASE_SERVICE_ROLE_KEY>'
  ),
  body    := '{}'::jsonb
);
```

## 6. Editing templates later

Every email body is a single row in `public.email_templates`. To edit
copy, update `subject` or `body_html` directly in the table editor (or
later via the admin dashboard built in Phase 2). Placeholders supported:

| Placeholder | Replaced by |
|---|---|
| `{{first_name}}` | recipient's first name |
| `{{score}}` | total assessment score (assessment sequences only) |
| `{{unsubscribe_url}}` | unsubscribe URL with the enrollment token |

The Edge Functions read templates by `(sequence_type, step)` filtered to
`active = true`. Set `active = false` to retire a template; insert a new
row with `active = true` to replace it without losing the history.

## 7. Regenerating the seed

If the source-of-truth copy needs to be refreshed wholesale:

```bash
python supabase/scripts/build_phase_1.py
# overwrites supabase/migrations/20260506_phase_1_core.sql
```

Then re-run the migration in the SQL editor — the seed `delete + insert`
block resets all five sequences cleanly.

## Lead-score reference

| Event                          | +score |
|--------------------------------|-------:|
| `page_view`                    | 1      |
| `scroll_50`                    | 2      |
| `scroll_90`                    | 3      |
| `case_study_open`              | 5      |
| `work_with_nathan_visit`       | 8      |
| `assessment_started`           | 10     |
| `assessment_completed`         | 20     |
| `playbook_requested`           | 15     |
| `booking_clicked`              | 25     |
| return visit (per visit, ≤3)   | 10     |

| Total score | Intent tier |
|------------:|-------------|
| 0–20        | low         |
| 21–50       | medium      |
| 51+         | high        |
