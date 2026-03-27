#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_REF="${SUPABASE_PROJECT_REF:-${VITE_SUPABASE_PROJECT_ID:-}}"
if [[ -z "$PROJECT_REF" ]]; then
  echo "[deploy] Missing SUPABASE_PROJECT_REF (or VITE_SUPABASE_PROJECT_ID)."
  exit 1
fi
if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "[deploy] Missing SUPABASE_ACCESS_TOKEN."
  exit 1
fi

DEPLOY_MIGRATIONS="${DEPLOY_MIGRATIONS:-true}"
DEPLOY_FUNCTIONS="${DEPLOY_FUNCTIONS:-true}"

echo "[deploy] Project ref: ${PROJECT_REF}"
if [[ "$DEPLOY_MIGRATIONS" == "true" ]]; then
  echo "[deploy] Applying database migrations via Management API..."
  VITE_SUPABASE_PROJECT_ID="$PROJECT_REF" SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" node scripts/run-migrations.js
else
  echo "[deploy] Skipping migrations (DEPLOY_MIGRATIONS=${DEPLOY_MIGRATIONS})."
fi

declare -a secret_pairs=()
[[ -n "${GEMINI_API_KEY:-}" ]] && secret_pairs+=("GEMINI_API_KEY=${GEMINI_API_KEY}")
[[ -n "${GEMINI_MODEL:-}" ]] && secret_pairs+=("GEMINI_MODEL=${GEMINI_MODEL}")
[[ -n "${OPENAI_API_KEY:-}" ]] && secret_pairs+=("OPENAI_API_KEY=${OPENAI_API_KEY}")
[[ -n "${OPENAI_MODEL:-}" ]] && secret_pairs+=("OPENAI_MODEL=${OPENAI_MODEL}")
[[ -n "${SERVICE_ROLE_JWT:-}" ]] && secret_pairs+=("SERVICE_ROLE_JWT=${SERVICE_ROLE_JWT}")
[[ -n "${EDGE_INVOKE_JWT:-}" ]] && secret_pairs+=("EDGE_INVOKE_JWT=${EDGE_INVOKE_JWT}")

if [[ ${#secret_pairs[@]} -gt 0 ]]; then
  echo "[deploy] Updating Supabase function secrets..."
  supabase secrets set --project-ref "$PROJECT_REF" "${secret_pairs[@]}"
else
  echo "[deploy] No optional model/invocation secrets provided; skipping supabase secrets set."
fi

declare -a functions=(
  "classifier"
  "retrieve_context"
  "decide"
  "execute"
  "store_result"
  "orchestrate"
  "brain_status"
  "brain_result"
  "orchestrate-domain"
  "retrieve-context"
  "execute-workflow"
)
declare -A seen=()

if [[ "$DEPLOY_FUNCTIONS" == "true" ]]; then
  echo "[deploy] Deploying edge functions..."
  for fn in "${functions[@]}"; do
    if [[ -n "${seen[$fn]:-}" ]]; then
      continue
    fi
    seen["$fn"]=1
    echo "[deploy] - ${fn}"
    supabase functions deploy "$fn" --project-ref "$PROJECT_REF"
  done
else
  echo "[deploy] Skipping edge function deployment (DEPLOY_FUNCTIONS=${DEPLOY_FUNCTIONS})."
fi

echo "[deploy] Supabase deployment completed successfully."
