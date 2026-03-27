# Brain Layer Implementation (ChatGPT + Gemini)

## Runtime Model Split

- `Gemini` = primary execution model (classification, context response shaping, first-pass actions)
- `ChatGPT` = escalation model for low confidence or high-risk requests
- `Supabase` = memory, prompts, workflows, decision trace, vector store
- `Edge Functions` = deterministic orchestrator between input and output

## Deterministic Pipeline

1. `classifier`
2. `retrieve_context`
3. `decide`
4. `execute`
5. `store_result`

Required run states:
- `queued`, `running`, `waiting_review`, `retrying`, `completed`, `failed`, `fallback`

## What Was Added

- Migration: `supabase/migrations/20260326000001_brain_layer_foundation.sql`
  - `brain_prompts`, `brain_prompt_versions`
  - `brain_frameworks`, `brain_workflows`
  - `brain_runs`, `brain_decision_runs`, `brain_workflow_runs`, `brain_outcomes`
  - `brain_memory_logs`
  - `brain_knowledge_documents`, `brain_knowledge_chunks` (pgvector)
  - `brain_tool_registry`
  - similarity RPC: `match_brain_chunks(...)`
  - indexes, update triggers, RLS policies, starter prompt seed

- Functions:
  - `supabase/functions/classifier/index.ts`
  - `supabase/functions/retrieve_context/index.ts`
  - `supabase/functions/decide/index.ts`
  - `supabase/functions/execute/index.ts`
  - `supabase/functions/store_result/index.ts`
  - `supabase/functions/orchestrate/index.ts`
  - `supabase/functions/brain_status/index.ts`
  - `supabase/functions/brain_result/index.ts`
  - shared utility: `supabase/functions/_shared/brain.ts`

## Environment Variables

Set these for local + deployed functions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (default: `gemini-1.5-flash`)
- `OPENAI_API_KEY` (optional until escalation enabled)
- `OPENAI_MODEL` (default: `gpt-4o-mini`)

## Deploy Steps

1. Run migration:
   - `supabase db push`
2. Deploy functions:
   - `supabase functions deploy classifier`
   - `supabase functions deploy retrieve_context`
   - `supabase functions deploy decide`
   - `supabase functions deploy execute`
   - `supabase functions deploy store_result`
  - `supabase functions deploy orchestrate`
  - `supabase functions deploy brain_status`
  - `supabase functions deploy brain_result`
3. Set secrets:
   - `supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=... OPENAI_API_KEY=... OPENAI_MODEL=...`

## Minimal End-to-End Test

1. One-call pipeline:
   - POST `functions/v1/orchestrate`
   - body:
   - `{"request_id":"req_001","profile_id":"<uuid>","input":"API is failing with 500s","actions":[{"tool_name":"create_ticket","data":{"title":"API failure"}}]}`
2. Status polling:
   - GET `functions/v1/brain_status?run_id=<run_id>&profile_id=<uuid>`
3. Result fetch:
   - GET `functions/v1/brain_result?run_id=<run_id>&profile_id=<uuid>`

## Guardrails

- All executable actions are allowlisted via `brain_tool_registry`
- Confidence under `0.6` routes to `waiting_review`
- Decision trace and chosen model are written to memory logs

## Production Integration (GitHub + Supabase)

- CI workflow: `.github/workflows/pmo-ops-ci.yml`
- Deploy workflow: `.github/workflows/deploy-supabase.yml`
- Local deploy scripts:
  - `npm run supabase:migrate`
  - `npm run supabase:deploy`

For full production setup, required GitHub secrets, and rollout steps, see:

- `docs/production-github-supabase-integration.md`
