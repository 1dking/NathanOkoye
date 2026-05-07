#!/usr/bin/env bash
# =====================================================================
# set-supabase-secrets.sh
#
# Reads SMTP_* values from .env.local and pushes them to Supabase as
# Edge Function secrets in a single call. SUPABASE_URL and
# SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase into every
# function — they don't need to be set as secrets.
#
# Usage:
#   1. Fill in SMTP_* values in .env.local
#   2. Either:
#        a. Add SUPABASE_ACCESS_TOKEN=sbp_... to .env.local (recommended,
#           non-interactive — generate at
#           https://supabase.com/dashboard/account/tokens), OR
#        b. Run `supabase login` once interactively
#   3. supabase link --project-ref hfioxbfdcbqsuxgvsogy   (once)
#   4. ./scripts/set-supabase-secrets.sh
#
# If the `supabase` CLI isn't installed globally, the script falls back to
# `npx --yes supabase` (downloads on first run).
#
# After running:
#   supabase secrets list        # to verify
# =====================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.local"

# ---- Pre-flight ------------------------------------------------------
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found." >&2
  echo "  Copy .env.example to .env.local and fill in the values first." >&2
  exit 1
fi

# Pick a Supabase CLI invocation: prefer a global install, otherwise npx.
if command -v supabase >/dev/null 2>&1; then
  SUPABASE_CMD=(supabase)
elif command -v npx >/dev/null 2>&1; then
  echo "→ 'supabase' not in PATH; falling back to 'npx --yes supabase'."
  SUPABASE_CMD=(npx --yes supabase)
else
  echo "Error: neither 'supabase' nor 'npx' found in PATH." >&2
  echo "  Install Supabase CLI: https://supabase.com/docs/guides/cli/getting-started" >&2
  echo "  Or install Node.js (which provides npx): https://nodejs.org" >&2
  exit 1
fi

# ---- Read a value out of .env.local ---------------------------------
# Returns the value after the first '=' on the matching line.
# Handles trailing CR (Windows line endings) and surrounding quotes.
read_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | head -n 1 || true)"
  if [[ -z "$line" ]]; then
    return 1
  fi
  local val="${line#${key}=}"
  val="${val%$'\r'}"           # strip CRLF
  # strip optional surrounding quotes
  if [[ "$val" =~ ^\"(.*)\"$ ]]; then val="${BASH_REMATCH[1]}"; fi
  if [[ "$val" =~ ^\'(.*)\'$ ]]; then val="${BASH_REMATCH[1]}"; fi
  printf '%s' "$val"
}

require() {
  local key="$1"
  local value
  value="$(read_env "$key")" || true
  if [[ -z "$value" ]]; then
    echo "Error: $key is empty (or missing) in $ENV_FILE." >&2
    echo "  Open .env.local, fill in $key, then re-run this script." >&2
    exit 1
  fi
  printf '%s' "$value"
}

# ---- Auto-export SUPABASE_ACCESS_TOKEN if present in .env.local -----
# The CLI reads SUPABASE_ACCESS_TOKEN from the environment, so plumbing it
# through here lets the script run non-interactively (no `supabase login`).
if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  TOKEN_FROM_FILE="$(read_env SUPABASE_ACCESS_TOKEN || true)"
  if [[ -n "$TOKEN_FROM_FILE" ]]; then
    export SUPABASE_ACCESS_TOKEN="$TOKEN_FROM_FILE"
    echo "→ Loaded SUPABASE_ACCESS_TOKEN from $ENV_FILE."
  fi
fi

# ---- Pull the five SMTP values --------------------------------------
SMTP_HOST="$(require SMTP_HOST)"
SMTP_PORT="$(require SMTP_PORT)"
SMTP_USER="$(require SMTP_USER)"
SMTP_PASS="$(require SMTP_PASS)"
SMTP_FROM_NAME="$(require SMTP_FROM_NAME)"

# ---- Push to Supabase in a single command ---------------------------
echo "→ Pushing SMTP secrets to Supabase Edge Functions…"
echo "    SMTP_HOST       = $SMTP_HOST"
echo "    SMTP_PORT       = $SMTP_PORT"
echo "    SMTP_USER       = $SMTP_USER"
echo "    SMTP_PASS       = $(printf '%s' "$SMTP_PASS" | sed 's/./•/g')"   # masked
echo "    SMTP_FROM_NAME  = $SMTP_FROM_NAME"
echo ""

"${SUPABASE_CMD[@]}" secrets set \
  SMTP_HOST="$SMTP_HOST" \
  SMTP_PORT="$SMTP_PORT" \
  SMTP_USER="$SMTP_USER" \
  SMTP_PASS="$SMTP_PASS" \
  SMTP_FROM_NAME="$SMTP_FROM_NAME"

echo ""
echo "✓ Secrets set. Verify with: ${SUPABASE_CMD[*]} secrets list"
