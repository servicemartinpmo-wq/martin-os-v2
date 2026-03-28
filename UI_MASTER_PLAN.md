# Martin OS — UI / product master reference

Canonical paths and rules. **Do not duplicate token definitions** outside [`src/styles/theme-engine.css`](src/styles/theme-engine.css).

## Perspectives (`appView` from route)

| Path prefix   | `appView`   | Default `data-theme` accent family |
| ------------- | ----------- | ----------------------------------- |
| `/pmo-ops`    | `PMO`       | `pmo`                               |
| `/tech-ops`   | `TECH_OPS`  | `tech_ops`                          |
| `/miidle`     | `MIIDLE`    | `miidle`                            |
| `/` (rest)    | `PMO`       | `pmo`                               |

Sync: [`src/lib/appViewFromPath.js`](src/lib/appViewFromPath.js) + [`MartinOsProvider`](src/context/MartinOsProvider.jsx).

## Operating modes (`operatingMode`)

Orthogonal to `appView`. Industry sets **default**; user overrides in Settings.

| Mode        | Shell component      | Notes                                      |
| ----------- | -------------------- | ------------------------------------------ |
| `assisted`  | `AssistedShell`      | `--font-size-scale`, simplified chrome     |
| `creative`  | `CreativeShell`      | editorial grid; `DashboardCard` needs cover |
| `project`   | `ProjectShell`       | `--layout-density: compact`                |
| `founder`   | `FounderShell`       | health strip, risk feed regions            |

Matrix: [`src/lib/industryMatrix.js`](src/lib/industryMatrix.js).

## Theme presets (`themePresetId`)

User-selected in [`app/settings`](app/settings). Sets `data-theme` on `<html>` + CSS variables — does not replace Catalyst/Headless markup.

Defined in [`src/lib/themePresets.js`](src/lib/themePresets.js).

## Catalyst / Tailwind Plus

- **Official:** [Catalyst UI Kit](https://tailwindcss.com/plus/ui-kit) (ZIP, licensed).
- **This repo:** [`src/components/catalyst/`](src/components/catalyst/) — primitives compatible with Catalyst patterns using **Headless UI** + tokens; replace with purchased ZIP when available.

## Component registry (high level)

| Route area   | Components |
| ------------ | ---------- |
| All shells   | `LayoutOrchestrator`, `AppShell`, `OSNav` |
| PMO          | `NextActionCard`, `PmoOpsLiveKpis`         |
| Tech-Ops     | `LiveLogs`                                 |
| Miiddle      | `MiidleStream`, `Miidle`                  |
| Settings     | preset + industry + mode toggles           |

## Phases (engineering)

**A** — Theme engine, provider, orchestrator, toasts, keyboard, Pexels/`next/image`, motion presets.  
**B** — DashboardCard, streams, DescriptionLayer MVP.  
**C+** — `/api/ai`, brain, agents, autonomy (gated), product surfaces per plan.

## Intelligence (code)

- Brain: `src/brain/`
- Agents: `src/agents/`
- Autonomy: `src/autonomy/` — `AUTONOMY_ENABLED` default `false`
- Layers doc: `src/system/layers/`

## Media (Pexels)

Presets in [`src/lib/pexelsPresets.js`](src/lib/pexelsPresets.js): **4K+** stills, **≥50 fps** video only; responsive `sizes`; never `text-white` on raw photos without scrim.
