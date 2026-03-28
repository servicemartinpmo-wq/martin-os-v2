# Uploaded PDF Requirements Matrix

This file tracks requirements pulled from the uploaded planning PDFs and maps them to implementation status and blueprint sections.

Source documents:
- `CURRENT_ PMO-Ops App Plan - v3.pdf`
- `miidle – Master Build & Business Plan.pdf`

Primary implementation contract:
- `docs/AI_WORKERS_MASTER_BLUEPRINT.md`

## 1) PMO-Ops feature masterlist coverage

| Requirement ID | Feature | Status | Current Coverage | Next Build Item |
|---|---|---|---|---|
| `PMO-FM-01` | Dashboard / Command View | partial | Initiative health worker slice + workflow routing + recommendations pipeline | Add dashboard API composition for priorities, delegation, and trend overlays |
| `PMO-FM-02` | Initiatives page (status/filter/drilldown) | partial | Signals/recommendations data exists for risk and status diagnostics | Add initiative-scoped query endpoints with sort/filter contracts |
| `PMO-FM-03` | Action Items & Events (email/WhatsApp/manual) | partial | Action item creation in execution worker | Add event ingestion connectors and source-link/reference storage |
| `PMO-FM-04` | Systems (Admin) analytics + role/access | partial | Org/workflow telemetry foundation present | Add admin views for role matrix, quality control, delegation trends |
| `PMO-FM-05` | Resource Hub (templates/workflows/SOPs) | partial | Workflow templates seeded in migration | Add template metadata, usage analytics, and preview/deploy endpoints |
| `PMO-FM-06` | Team page + accountability model | pending | Team linkage exists in core data model directionally | Add team update snapshots + role accountability views |
| `PMO-FM-07` | Advisory module (core + optional advisors) | partial | Advisory worker implemented for initiative health slice | Add advisor taxonomy + intake APIs with upload metadata |
| `PMO-FM-08` | Reports (prebuilt/custom/export) | pending | Health scoring artifacts are persisted | Add report builder/export services and scheduled report jobs |
| `PMO-FM-09` | Onboarding & intake wizard | pending | Organizational data foundation exists | Add intake workflows for org profile, industry, and historical imports |
| `PMO-FM-10` | Integrations (G-Suite, M365, WhatsApp, etc.) | partial | Integration bridge strategy defined in blueprint | Implement connectors with canonical event normalization and idempotency |
| `PMO-FM-11` | Pricing/tiers/entitlements | partial | Entitlements and tier gates specified in blueprint | Add runtime entitlement checks in all ingress/execute paths |

## 2) miidle master build coverage

| Requirement ID | Feature | Status | Current Coverage | Next Build Item |
|---|---|---|---|---|
| `MIIDDLE-FM-01` | Execution capture engine | pending | Captured as architecture requirement in blueprint | Implement passive action logging + high-detail toggle |
| `MIIDDLE-FM-02` | Work graph | pending | Graph projection tables designed in blueprint | Build node/edge projection jobs and query endpoints |
| `MIIDDLE-FM-03` | Build Story generator (video/audio/cards/write-up) | pending | Output contracts and workflow model direction established | Implement content-generation workflow workers + storage routing |
| `MIIDDLE-FM-04` | Write-up mode with strict constraints | pending | Constraints documented in uploaded plan and incorporated in blueprint | Add validation rules and publish gates for write-up generation |
| `MIIDDLE-FM-05` | Spectator layer + feed/filter/follow/remix | pending | Required output artifacts and growth intent documented | Build feed APIs and follow/remix event model |
| `MIIDDLE-FM-06` | PMO/Ops/Tech cross-linking | partial | Cross-domain contract and integration strategy defined | Add deep-link relationships between work artifacts and stories |
| `MIIDDLE-FM-07` | Tier model + badges + reputation | pending | Monetization hooks + entitlements are defined | Add badge ledger, tier gating, and visibility policy enforcement |

## 3) Traceability enforcement

All implementation PRs should include:
1. Requirement IDs touched (`PMO-FM-*`, `MIIDDLE-FM-*`).
2. Artifact list (migration, function, route, UI component, tests).
3. Verification evidence (test command output, runtime logs, walkthrough artifact when UI is changed).

## 4) Confirmation

These uploaded PDFs are now treated as active requirement sources for the primary build.
