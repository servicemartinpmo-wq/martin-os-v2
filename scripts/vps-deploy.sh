#!/usr/bin/env bash
# One-shot production run on your VPS (from repo root). Uses .env.production if present.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.production ]]; then
  echo "Martin OS: tip — create .env.production from .env.example for live Supabase (optional)."
fi

npm ci
npm run build
echo "Martin OS: listening on 0.0.0.0:3000 — test with: curl -sS http://127.0.0.1:3000/api/health"
exec npm run start:host
