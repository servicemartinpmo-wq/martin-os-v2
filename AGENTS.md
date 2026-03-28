# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Martin OS is a Next.js 14 (App Router) single-process application — a tri-native dashboard combining **PMO-Ops** (host), **Tech-Ops**, and **Miidle** as native plugins. All API routes are colocated; there is no separate backend.

### Running the app

See `README.md` for standard commands (`pnpm dev`, `pnpm build`, `pnpm lint`). The dev server binds to `127.0.0.1:3000`.

### Key caveats

- **Both lockfiles exist** (`pnpm-lock.yaml` and `package-lock.json`). Use **pnpm** as the primary package manager; the `.npmrc` sets `legacy-peer-deps=true`.
- **No external services required for local dev.** Supabase, Pexels API, and Vercel AI Gateway all have graceful fallbacks to demo/static data when env vars are absent.
- **Pre-existing lint error:** `src/components/pmo/DiagnosticEngine.jsx` references an undefined `selectedDiagnostic` variable. This also causes `pnpm build` to fail on the `/pmo-ops/diagnostics` and `/tech-ops/diagnostics` static pages. The dev server (`pnpm dev`) is unaffected because those pages compile on-demand as client components.
- **Tailwind v4** is used with `@tailwindcss/postcss` (not the older `tailwindcss` PostCSS plugin). Theme CSS lives in `src/styles/`.
- **Path alias:** `@/*` maps to `src/*` (configured in `jsconfig.json`).
- **ESLint 10** with flat config (`eslint.config.js`). The `no-unused-vars` rule ignores variables starting with an uppercase letter or underscore.
- **No automated test suite** exists in this repo (no Jest, Vitest, Cypress, Playwright, etc.). Lint (`pnpm lint`) is the primary automated check.
