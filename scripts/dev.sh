#!/usr/bin/env bash
# One command local stack: Colima → Supabase → Next.js.
# Usage: ./scripts/dev.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ensure_docker() {
  if ! command -v colima >/dev/null 2>&1; then
    echo "Colima is required. Install with: brew install colima docker" >&2
    exit 1
  fi
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker CLI is required. Install with: brew install docker" >&2
    exit 1
  fi

  # Point at Colima even if a stale Docker Desktop context is still selected.
  export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"

  if colima status >/dev/null 2>&1; then
    echo "==> Colima already running"
  else
    echo "==> Starting Colima"
    colima start
  fi

  docker context use colima >/dev/null 2>&1 || true

  echo "==> Waiting for Docker"
  local i
  for i in $(seq 1 60); do
    if docker info >/dev/null 2>&1; then
      echo "==> Docker ready ($(docker context show 2>/dev/null || echo colima))"
      return 0
    fi
    sleep 1
  done

  echo "Docker did not become ready after starting Colima." >&2
  exit 1
}

ensure_docker

echo "==> Starting local Supabase"
npx --yes supabase start

# Exports API_URL, ANON_KEY, etc. from the local stack
eval "$(npx --yes supabase status -o env)"

export NEXT_PUBLIC_SUPABASE_URL="${API_URL:?supabase status did not set API_URL}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${ANON_KEY:?supabase status did not set ANON_KEY}"

# Local defaults (override by exporting before running this script)
export ALLOWED_EMAIL="${ALLOWED_EMAIL:-you@example.com}"
export DEV_AUTO_LOGIN="${DEV_AUTO_LOGIN:-true}"
export DEV_LOGIN_PASSWORD="${DEV_LOGIN_PASSWORD:-local-dev-password}"

echo "==> Local Supabase at ${NEXT_PUBLIC_SUPABASE_URL}"
echo "==> Starting Next.js (http://localhost:3000)"
npm run dev
