# Miiddle

Miiddle is a standalone Vite + React app in [`miiddle/`](../../miiddle/) and an optional iframe integration in PMO-Ops (`/miiddle/*`).

## Run locally

From the monorepo root (with pnpm or npm):

```bash
cd miiddle && npm install && npm run dev
```

Default dev server: `http://localhost:5010`. The PMO-Ops Express server probes `GET {MIIDDLE_BASE_URL}/health.json` to decide if the embed is online.

## PMO-Ops configuration

Set in `mpo-pilot-main/.env` (see `.env.example`):

- `VITE_ENABLE_MIIDDLE=true` — show **Miiddle** in the sidebar (inserted after Tech-Ops when that nav item exists).
- `VITE_MIIDDLE_BASE_URL` — optional client fallback base URL.
- `MIIDDLE_BASE_URL` — server-side URL for health checks (defaults mirror `VITE_MIIDDLE_BASE_URL`, then `http://localhost:5010`).

The host route `/miiddle/*` is always registered so deep links work even when the nav item is hidden.

## Deploy

Build the Miiddle app (`npm run build` in `miiddle/`) and deploy the `dist/` output to any static host. Ensure `health.json` is served at `/health.json` (included under `miiddle/public/`).

Point `MIIDDLE_BASE_URL` / `VITE_MIIDDLE_BASE_URL` at that deployment URL.

## Extract to a separate repository

1. Copy the `miiddle/` directory to a new repo (or use `git subtree split`).
2. Remove from the monorepo: `miiddle/`, the `miiddle` line in `pnpm-workspace.yaml`, PMO-Ops files under `src/components/MiiddleEmbed/`, `src/pages/MiiddleAddOn.tsx`, `src/lib/featureFlags.ts` (if only used for Miiddle), route and nav wiring, server `/api/miiddle/*`, and tests `src/test/miiddleEmbed.test.tsx`.

## Product / business plan alignment

Place the master build & business plan PDF under `docs/miiddle/` (or paste an outline in the issue tracker) to drive:

- Final in-app routes (beyond `/` and `/dashboard` placeholders).
- Auth model (public vs PMO session, SSO, cookies).
- Server APIs (additional `/api/miiddle/*` proxy or sync endpoints).

Until then, the scaffold is intentionally minimal.
