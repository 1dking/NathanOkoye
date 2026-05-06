# Nathan Okoye — Supabase backend (Phase 1)

Project ref: `hfioxbfdcbqsuxgvsogy` ·
URL: `https://hfioxbfdcbqsuxgvsogy.supabase.co`

This folder contains everything needed to stand up the Phase 1 backend.

```
supabase/
├── migrations/
│   └── 20260506_phase_1_core.sql         # Run once in SQL editor
├── functions/
│   ├── _shared/                          # cors, supabase client, smtp, sequences, email template
│   ├── track-event/                      # POST  /functions/v1/track-event
│   ├── on-assessment-submit/             # WEBHOOK from assessment_submissions INSERT
│   ├── on-playbook-request/              # WEBHOOK from playbook_requests INSERT
│   ├── process-sequences/                # CRON  every hour
│   └── unsubscribe/                      # GET   /functions/v1/unsubscribe?token=…
└── README.md (this file)
```

## 1. Run the migration

Open Supabase Dashboard → SQL Editor → New query.
Paste the contents of `migrations/20260506_phase_1_core.sql` and run it.

The migration is idempotent (`if not exists` everywhere), so re-running is
safe if anything fails partway through.

## 2. Set Edge Function secrets

Dashboard → Project Settings → Edge Functions → Manage secrets, **or** via CLI:

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

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
into every Edge Function — you don't set those.

## 3. Deploy each Edge Function

```bash
supabase functions deploy track-event
supabase functions deploy on-assessment-submit
supabase functions deploy on-playbook-request
supabase functions deploy process-sequences
supabase functions deploy unsubscribe
```

(Or via Dashboard → Edge Functions → New → upload the folder for each.)

## 4. Wire the database webhooks

Dashboard → Database → Webhooks → "Create a new hook":

**Hook 1 · `on-assessment-submit`**
- Name: `on-assessment-submit`
- Source table: `public.assessment_submissions`
- Events: ☑ Insert (only)
- Type: HTTP Request
- URL: `https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/on-assessment-submit`
- Method: POST
- HTTP headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <<SUPABASE_SERVICE_ROLE_KEY>>`

**Hook 2 · `on-playbook-request`**
- Name: `on-playbook-request`
- Source table: `public.playbook_requests`
- Events: ☑ Insert (only)
- Type: HTTP Request
- URL: `https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/on-playbook-request`
- Method: POST
- Same headers as above

## 5. Schedule the cron job

Dashboard → Database → Cron Jobs → New cron job:

- Name: `process-sequences-hourly`
- Schedule: `0 * * * *`  (every hour, on the hour)
- Command:

```sql
select net.http_post(
  url     := 'https://hfioxbfdcbqsuxgvsogy.supabase.co/functions/v1/process-sequences',
  headers := jsonb_build_object(
    'Content-Type',  'application/json',
    'Authorization', 'Bearer <<SUPABASE_SERVICE_ROLE_KEY>>'
  ),
  body    := '{}'::jsonb
);
```

(Requires the `pg_net` extension — enable in Database → Extensions if not on.)

## 6. Verify

- Submit a test row through the Next.js assessment form. The
  `on-assessment-submit` webhook should fire and you should receive an email
  within ~30s.
- Check `email_logs` for `status='sent'`.
- Check `sequence_enrollments` for the new row with `current_step=1` and
  `next_send_at` ~3-7 days out.
- The unsubscribe link in the email footer should resolve to a confirmation page.

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
