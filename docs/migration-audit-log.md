# Universal Backend Migration Audit Log

## Summary

This migration decouples frontend UI from business/data orchestration by introducing a typed internal API layer, backend service modules, and a vanilla JS headless bridge for WeWeb.

## Logic moved and mapped

### 1) Direct Supabase access from frontend hooks

- **From:** `src/hooks/useSupabaseTable.js` and `src/hooks/useSupabaseMutation.js`
- **To:** `src/lib/services/dashboardService.js` + `app/api/goals/route.js`, `app/api/techops/route.js`, `app/api/miiddle/route.js`
- **Result:** frontend feature hooks no longer call `supabase.from()` directly; they call internal API clients.

### 2) Frontend dashboard data orchestration

- **From:** `src/features/pmo/usePmoOrgDashboardData.js`
- **To:** `src/lib/api/dashboard.js` -> `GET /api/goals` -> `src/lib/services/dashboardService.js`

- **From:** `src/features/techops/useTechOpsDashboardData.js`
- **To:** `src/lib/api/dashboard.js` -> `GET /api/techops` -> `src/lib/services/dashboardService.js`

- **From:** `src/features/miiddle/useMiiddleDashboardData.js`
- **To:** `src/lib/api/dashboard.js` -> `GET /api/miiddle` -> `src/lib/services/dashboardService.js`

### 3) Frontend AI call path

- **From:** `src/brain/brainEngine.js` calling `/api/ai` directly
- **To:** `src/lib/api/ai.js` (`runBrainRequest`) -> `/api/ai`
- **Result:** standardized client-side API access and reusable headless contracts.

### 4) Frontend agent orchestration call path

- **From:** `src/agents/orchestrator.js` invoking `runAgent` (which called `/api/ai` per agent)
- **To:** `src/lib/api/orchestrator.js` -> `POST /api/ai/orchestrate`
- **Result:** orchestration delegated to backend route and service plan.

### 5) Agent panel component orchestration

- **From:** `src/components/agents/AgentPanel.jsx` importing `runOrchestrator` from frontend agent module
- **To:** `src/components/agents/AgentPanel.jsx` importing `runOrchestratorRequest` from `src/lib/api/orchestrator.js`
- **Result:** component becomes thin UI client for backend orchestration API.

## New backend contracts and routes

- `src/lib/contracts/dashboardContracts.js`
- `src/lib/contracts/aiContracts.js`
- `src/lib/http/zodRoute.js`
- `app/api/goals/route.js`
- `app/api/techops/route.js`
- `app/api/miiddle/route.js`
- `app/api/ai/orchestrate/route.js`

## Headless bridge for WeWeb

- `headless-bridge/martin-sdk.js`
  - Zero-dependency SDK
  - JSON request helpers
  - streaming handler with `ReadableStream` + `TextDecoder`

## OpenAPI export

- `docs/openapi.json`
  - Added current contract surface for:
    - `/api/goals`
    - `/api/techops`
    - `/api/miiddle`
    - `/api/ai`
    - `/api/ai/orchestrate`

## Remaining follow-up migration items

1. Move memory stream persistence from `src/brain/memoryStore.js` demo memory to DB-backed `/api/memory`.
2. Replace `/api/learning` in-memory store with DB table-backed service.
3. Move merge pass (`/api/merge`) into orchestrate service/edge function and expose typed contract.
4. Introduce idempotency keys for write endpoints (`/api/memory`, `/api/learning`, preferences writes).
5. Optionally shift `/api/ai/orchestrate` heavy execution to Supabase Edge Function while keeping route as compatibility façade.
