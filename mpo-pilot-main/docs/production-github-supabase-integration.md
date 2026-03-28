# Production Integration: GitHub + Supabase

This document makes the Brain Layer automation production ready with GitHub Actions and Supabase deployment controls.

## What is integrated

- CI quality gate on pull requests and `main` pushes (`.github/workflows/pmo-ops-ci.yml`)
- Supabase deploy pipeline for migrations + edge functions (`.github/workflows/deploy-supabase.yml`)
- Scripted deployment entrypoints:
  - `npm run supabase:migrate`
  - `npm run supabase:deploy`

## Required GitHub secrets

Configure these repository or environment secrets before production deploy:

- `SUPABASE_PROJECT_REF` (production project ref)
- `SUPABASE_ACCESS_TOKEN` (Supabase personal access token for CI deploy)
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional, defaults used in runtime if omitted)
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, defaults used in runtime if omitted)
- `SERVICE_ROLE_JWT` (recommended for secure edge invocation paths)
- `EDGE_INVOKE_JWT` (optional fallback for function invocation auth)

## Recommended GitHub environments

Create two GitHub environments:

- `staging`
- `production` (with required reviewers for manual approval)

The deploy workflow uses environment-scoped secrets and protection rules.

## Deployment modes

The deploy workflow supports:

- automatic deploy on push to `main` when `supabase/**` files change
- manual deploy (`workflow_dispatch`) with flags:
  - `deploy_migrations`
  - `deploy_functions`
  - target `environment` (`staging` or `production`)

## Local production-like deploy

From `mpo-pilot-main/`:

- `npm run supabase:migrate` to apply pending SQL migrations
- `npm run supabase:deploy` to apply migrations + set secrets + deploy edge functions

`scripts/deploy-supabase.sh` supports:

- `DEPLOY_MIGRATIONS=true|false`
- `DEPLOY_FUNCTIONS=true|false`

## Safety behavior

- migrations run through `scripts/run-migrations.js` with idempotent apply tracking
- function secrets are only set when values are present
- edge deployments are deterministic and deduplicated by function name
- governance-sensitive runs still route to `waiting_review` in the Brain Layer

## Suggested rollout checklist

1. Configure GitHub environment secrets for `staging`.
2. Trigger manual deploy to `staging` (both migrations + functions).
3. Run smoke checks against:
   - `orchestrate`
   - `brain_status`
   - `brain_result`
4. Configure `production` environment approval.
5. Trigger manual deploy to `production`.
6. Enable automatic deploy-on-main once production baseline is confirmed.
