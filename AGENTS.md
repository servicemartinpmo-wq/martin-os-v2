# AGENTS.md

## Cursor Cloud specific instructions

### Architecture overview

This is a multi-product monorepo ("Martin OS / Apphia Engine") with a pnpm workspace at the root. It contains:

| Service | Dir | Port | Tech |
|---------|-----|------|------|
| **Root app** (Martin OS Command Center) | `/workspace` | 3000 | TanStack Start + Convex + React 19 + Tailwind v4 |
| **MPO Pilot backend** | `mpo-pilot-main/server/` | 3001 | Express 5 + PostgreSQL (via `pg`) |
| **MPO Pilot frontend** | `mpo-pilot-main/` | 5001 | Vite + React 18 + shadcn/ui + Tailwind v3 |
| **Tech-Ops API** | `Tech-Ops-master/artifacts/api-server/` | 5000 | Express 5 + Drizzle ORM + PostgreSQL |
| **Tech-Ops frontend** | `Tech-Ops-master/artifacts/techops/` | 5173 | Vite 7 + React 19 + Radix UI + Tailwind v4 |
| **Miiddle** | `miiddle/` | 5010 | Vite + React 18 (micro-frontend) |

### Dependencies

- **Root + Tech-Ops workspace**: `pnpm install` at repo root (pnpm-lock.yaml).
- **MPO Pilot**: `npm install` inside `mpo-pilot-main/` (package-lock.json).
- Both lockfiles must be installed.

### Database

- PostgreSQL 16 with `pgvector` and `pg_trgm` extensions is required.
- Tech-Ops uses Drizzle ORM; push schema with: `DATABASE_URL=... pnpm --filter @workspace/db run push-force`
- MPO Pilot uses raw `pg` Pool; point `DATABASE_URL` at a separate database.

### Starting services

**Root app (port 3000)**:
```
VITE_CONVEX_URL="https://placeholder.convex.cloud" npx vite --port 3000
```
Convex schema is empty; the dashboard renders with mock data. A real `VITE_CONVEX_URL` is needed for live Convex queries.

**Tech-Ops API (port 5000)**:
```
cd Tech-Ops-master/artifacts/api-server
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/techops" \
PORT=5000 NODE_ENV=development \
AI_INTEGRATIONS_OPENAI_BASE_URL="https://api.openai.com/v1" \
AI_INTEGRATIONS_OPENAI_API_KEY="sk-placeholder" \
npx tsx ./src/index.ts
```
OpenAI calls gracefully fall back to local feature-hashing with a placeholder key.

**Tech-Ops frontend (port 5173)**:
```
cd Tech-Ops-master/artifacts/techops
PORT=5173 BASE_PATH="/" npx vite --config vite.config.ts
```

**MPO Pilot backend (port 3001)**:
```
cd mpo-pilot-main
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mpo_pilot" npx tsx server/index.ts
```
Auth setup requires `SESSION_SECRET`; it gracefully skips auth when missing.

**MPO Pilot frontend (port 5001)**:
```
cd mpo-pilot-main && npx vite --port 5001
```
Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase-backed features.

**Miiddle (port 5010)**:
```
cd miiddle && npx vite --port 5010
```

### Lint / Test / Typecheck

- **MPO Pilot lint**: `cd mpo-pilot-main && npx eslint .` — pre-existing lint errors (~150 `no-explicit-any`); not introduced by agent.
- **MPO Pilot tests**: `cd mpo-pilot-main && npx vitest run` — 19 tests, all pass.
- **Tech-Ops typecheck**: `cd Tech-Ops-master && pnpm run typecheck` — the `scripts` sub-package fails due to missing `stripe` types; core `api-server` and `techops` typecheck cleanly.

### Gotchas

- The root `package.json` was originally empty (no dependencies). The setup branch adds required TanStack Start + Convex + React dependencies.
- Tech-Ops `vite.config.ts` requires `PORT` and `BASE_PATH` env vars at dev time.
- `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` are required to start the Tech-Ops API server, but a placeholder key is fine (embeddings fall back to local hashing).
- The Tech-Ops auth page has a runtime error ("Crown is not defined") — this is a pre-existing code issue, not an environment problem.
- MPO Pilot frontend shows "App failed to start" without Supabase credentials — expected behavior.
