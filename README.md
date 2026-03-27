# MARTIN OS Frontend

Tri-native React frontend where `PMO-Ops` is the host shell and `Tech-Ops` plus
`Miidle` run as native plugins.

## Run locally

```bash
npm install
npm run dev
```

## Build checks

```bash
npm run lint
npm run build
```

## Optional Pexels integration

Miidle supports optional remote image sourcing from Pexels with automatic fallback
to local curated content when no key is provided.

1. Copy `.env.example` to `.env.local`
2. Set your key:

```bash
NEXT_PUBLIC_PEXELS_API_KEY=your_real_key
```

If the key is missing or a request fails, the app continues using local media from
`src/data/contentRegistry.js` so content is never blocked.

## Plan 2/b brain-layer bridge

The UI now includes a lightweight intelligence pipeline:

- capture signals: `src/brain/capture/captureBus.js`
- scoring engine: `src/brain/engines/scoringEngine.js`
- narrative/outcome fragments: `src/brain/engines/narrativeEngine.js`
- recommendations/remix prompts: `src/brain/engines/recommendationEngine.js`
- runtime state: `src/store/intelligenceStore.js`
- live bridge hook: `src/hooks/useIntelligenceBridge.js`
- persistence bridge: `src/brain/persistence/brainPersistence.js`
- spectator contract mapping: `src/brain/contracts/spectatorContract.js`

Supabase-safe schema additions are prepared in:

- `supabase/migrations/20260327090000_plan2b_brain_layer.sql`
- `supabase/migrations/20260327101500_miidle_backend_foundation.sql`

Brain sync and auth-aware persistence:

- queue + sync worker: `src/brain/persistence/brainPersistence.js`
- periodic sync hook usage: `src/hooks/useIntelligenceBridge.js`

Miidle implementation prompts/workflows/launch:

- `docs/miidle-implementation-layer.md`
