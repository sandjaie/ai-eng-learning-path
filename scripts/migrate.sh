#!/usr/bin/env bash
# Applies pending migrations from supabase/migrations/ to the database.
# Usage: SUPABASE_DB_URL='postgresql://...' ./scripts/migrate.sh
set -euo pipefail
: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to your Postgres connection string (Supabase: Connect → Direct connection)}"
npx --yes supabase db push --db-url "$SUPABASE_DB_URL"
