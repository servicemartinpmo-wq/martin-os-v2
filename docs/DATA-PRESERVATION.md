# Data preservation & E2E integrity

Principles for evolving MARTIN OS without losing user-facing or stored content:

1. **Source of truth** — `src/data/contentRegistry.js` and user preferences in `localStorage` (`martin-os-active-plugin`, `martin-os-visual-preferences`) are treated as continuity contracts until an explicit migration replaces them.
2. **Adapters** — New UI should read through adapters (e.g. `pexelsAdapter.js`) so static fallbacks remain when APIs or keys are missing.
3. **Additive changes only** — Prefer new fields and backward-compatible defaults over renames or deletes of persisted keys.
4. **Verification** — Before merging visual refactors, run `npm run lint` and `npm run build`; spot-check plugin switches and Miidle media (API + fallback).

Rollback: restore the previous commit or re-add deleted keys with legacy readers in `App.jsx` initial state parsers.
