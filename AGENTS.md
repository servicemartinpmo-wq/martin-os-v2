## Cursor Cloud specific instructions

This is a monorepo ("apphia-engine") with four interconnected products. See `CLAUDE.md` for Convex-specific coding guidelines.

### Architecture overview

| Service | Location | Dev port | Package manager |
|---|---|---|---|
| **Tech-Ops API** | `Tech-Ops-master/artifacts/api-server/` | 8080 | pnpm (workspace) |
| **Tech-Ops Frontend** | `Tech-Ops-master/artifacts/techops/` | 5173 | pnpm (workspace) |
| **MPO-Pilot Backend** | `mpo-pilot-main/server/` | 3001 | npm |
| **MPO-Pilot Frontend** | `mpo-pilot-main/` (Vite) | 5001 | npm |
| **Miiddle** | `miiddle/` | 5010 | pnpm (workspace) |
| **Root / Martin OS** | `/` (TanStack Start + Convex) | 3000 | pnpm (workspace) |

### Dependency installation

- **Root pnpm workspace** covers: miiddle, Tech-Ops sub-packages, and root app. Run `pnpm install` from `/workspace`.
- **mpo-pilot-main** uses npm (has its own `package-lock.json`). Run `npm install` from `/workspace/mpo-pilot-main`.
- The `Tech-Ops-master/` root package is NOT a workspace member but its `typescript` dependency is needed globally for `tsc --build`. Install globally: `npm install -g typescript@5.9.3`.

### Database (PostgreSQL 16)

Tech-Ops API and MPO-Pilot server both require PostgreSQL. The shared database setup is:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/techops"
```

- Start PostgreSQL: `sudo pg_ctlcluster 16 main start`
- Extensions needed: `pgvector`, `pg_trgm` (already installed in the `techops` database)
- Push schema: `cd Tech-Ops-master/lib/db && DATABASE_URL=... npx drizzle-kit push --force --config ./drizzle.config.ts`
- pg_hba.conf is set to `md5` for local connections (password: `postgres`)

### Starting services

**Tech-Ops API** (must start first — other services depend on it):
```
cd Tech-Ops-master/artifacts/api-server
PORT=8080 DATABASE_URL="postgresql://postgres:postgres@localhost:5432/techops" \
  AI_INTEGRATIONS_OPENAI_BASE_URL="https://api.openai.com/v1" \
  AI_INTEGRATIONS_OPENAI_API_KEY="sk-placeholder" \
  npx tsx ./src/index.ts
```
- Health check: `GET /api/healthz` returns `{"status":"ok"}`
- Full status: `GET /api/status` returns subsystem health details
- `AI_INTEGRATIONS_OPENAI_*` env vars are required at startup even without a real key

**Tech-Ops Frontend:**
```
cd Tech-Ops-master/artifacts/techops
PORT=5173 BASE_PATH="/" npx vite --config vite.config.ts --host 0.0.0.0 --port 5173
```
- The vite config proxies `/api` to `http://localhost:8080`

**MPO-Pilot** (backend + frontend):
```
cd mpo-pilot-main
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mpo_pilot" npx tsx server/index.ts  # port 3001
npx vite --port 5001 --host 0.0.0.0  # frontend, proxies /api to 3001
```
- Frontend requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars to mount React. Without them the app shows "App failed to start".

**Miiddle:**
```
cd miiddle && npx vite --port 5010 --host 0.0.0.0
```

### Lint / Test / Build

- **mpo-pilot-main lint:** `cd mpo-pilot-main && npx eslint .` (pre-existing warnings/errors in repo)
- **mpo-pilot-main tests:** `cd mpo-pilot-main && npm run test:smoke` (18 tests; requires `@testing-library/dom` which is a missing peer dep — install via `npm install --save-dev @testing-library/dom` if needed)
- **Tech-Ops typecheck:** requires `tsc --build` from `Tech-Ops-master/` to build lib type declarations first, then `pnpm -r --filter "./artifacts/**" --if-present run typecheck`
- **Tech-Ops build:** `cd Tech-Ops-master && pnpm run build`

### Gotchas

- The `Tech-Ops-master/` root `package.json` is named `workspace` (same as its sub-packages) but is **not** included in the root `pnpm-workspace.yaml`. Its devDependencies (like `typescript`, `prettier`) are only available if installed globally or via the root workspace.
- The Tech-Ops frontend's `vite.config.ts` requires `PORT` and `BASE_PATH` env vars — it throws at startup without them.
- MPO-Pilot's Supabase client initializes at module load time and crashes if `VITE_SUPABASE_URL` is empty. There is no way to bypass this without real Supabase credentials.
- The root app (`/workspace/src/`) uses TanStack Start + Convex, but the Convex schema is empty and there's no deployed backend — it's currently a placeholder.
