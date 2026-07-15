#!/usr/bin/env bash
# Sanity checks for the learning-path tracker.
# Usage:
#   ./scripts/verify.sh          # lint + typecheck + test (pre-commit / fast)
#   ./scripts/verify.sh --full   # also production build (CI / before push)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FULL=0
for arg in "$@"; do
  case "$arg" in
    --full) FULL=1 ;;
    -h|--help)
      sed -n '2,5p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

step() {
  printf '\n==> %s\n' "$1"
}

step "lint"
npm run lint

step "typecheck"
npm run typecheck

step "test"
npm run test

if [[ "$FULL" -eq 1 ]]; then
  step "build"
  # Allow CI / fresh clones without a real .env.local
  NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://placeholder.supabase.co}" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-placeholder}" \
  npm run build
fi

printf '\nAll checks passed.\n'
