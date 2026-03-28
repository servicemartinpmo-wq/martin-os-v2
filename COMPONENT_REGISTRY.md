# Component registry (Martin OS)

Routes map to **Catalyst-compatible** primitives under `src/components/catalyst/` (Headless UI + theme tokens). Full [Catalyst](https://tailwindcss.com/plus/ui-kit) ZIP replaces these when licensed.

| Route / area | Components | Mode / notes |
|--------------|------------|--------------|
| Global | `MartinOsProvider`, `OSNav`, `KeyboardShortcuts`, `ToastContainer`, `LayoutOrchestrator`, shells | `operatingMode` selects shell; `themePresetId` → `data-theme` |
| `/` | `AppShell`, domain cards | Any mode |
| `/settings` | `Button`, forms, `ApprovalPanel`, `SystemPanel` | Theme + industry + mode |
| `/pmo-ops` | `NextActionCard`, `PmoOpsLiveKpis`, `DashboardCard` | Founder strip when mode founder |
| `/tech-ops` | `LiveLogs`, `HUDOverlay`-ready | Project density |
| `/miidle` | `MiidleStream`, `AgentPanel`, `Miidle` | Creative emphasis when industry agency |
| `/import` | Import wizard (connectors stub) | Adoption wedge |
| Media | `src/lib/pexelsPresets.js` — **4K+** stills, **≥50 fps** video only | `next/image` + scrim |

Pexels: [Pexels license](https://www.pexels.com/license/). Icons: Lucide / Catalyst — not photo thumbnails.
