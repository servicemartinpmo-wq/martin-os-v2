# PMO-Ops Command Center

## Overview
The PMO-Ops Command Center, codenamed "Apphia," is a single-page application designed for Martin PMO. It serves as a centralized hub for managing projects, decisions, initiatives, action items, departments, and teams. The application integrates strategic advisory frameworks, robust reporting, workflow automation, and an AI-driven organizational health engine. Its vision is to provide actionable insights and intelligent tools to enhance operational efficiency, strategic alignment, and decision-making. Key capabilities include an executive dashboard, comprehensive project and initiative management, AI-powered diagnostics, extensive reporting, workflow automation, knowledge management, expense management, subscription management, and finance report generation.

## User Preferences
- **Communication Style**: Clear, direct, and concise. Avoid jargon where simpler terms suffice.
- **Workflow**: Iterative development with clear milestones. Prioritize foundational features before advanced enhancements.
- **Interaction**: Ask for clarification or confirmation before implementing significant architectural changes or complex features. Provide options when multiple valid approaches exist.
- **Explanations**: Detailed explanations for non-trivial changes or design decisions are preferred.
- **Feedback**: Integrate feedback actively, ensuring changes align with specified requirements.
- **Deployment**: Focus on a stable and deployable product at each major iteration.

## System Architecture
The PMO-Ops Command Center is a Single Page Application (SPA) built with React 18 and TypeScript, using Vite for development.

- **UI/UX**: Utilizes Tailwind CSS for styling and `shadcn/ui` for accessible components. It features a light theme with a dark sidebar, specific accent colors (Electric Blue, Amber/Gold, Teal, Rose), and typography (Inter, JetBrains Mono). Visual elements include cinematic background images and interactive patterns like a global Command Palette, Top Status Bar, animated SVG progress rings, and card hover effects.
- **Authentication & Database**: Supabase handles authentication and database management. Replit Auth is also supported via an Express server using OpenID Connect (OIDC) and Passport.js, with user data upserted into a `replit_users` table. The `useAuth` hook manages both authentication states.
- **Server Stability**: The Express server includes global error handlers, a singleton database pool, Supabase admin client, keep-alive/headers timeouts, graceful shutdown, and a `/health` endpoint.
- **Demo Mode**: A guest access flow is available, bypassing Supabase auth and pre-loading a demo profile.
- **Routing**: React Router v6 manages client-side navigation.
- **State Management**: React Query for server-state, complemented by local React hooks for UI state.
- **Charting**: Recharts is used for data visualization.
- **AI Engine**: An internal AI engine (`src/lib/engine/`) provides advisory, maturity assessments, and signal generation. A Contextual Scoring Layer calibrates all outputs based on organizational profile, using factors like industry, company stage, and team size.
- **Core Components**: Key reusable components include `AppLayout`, `CompanyHealthScore`, `NotificationsPanel`, `InsightCard`, `OrgHealthOrb`, `OnboardingWizard`, and `PageBanner`.
- **PMO-Ops Fallback System**: Provides a static fallback experience with templates and rule-based recommendations when the live engine is unavailable.
- **Tech-Ops Module**: A system for backup, file management, and data reorganization at `/tech-ops`. It allows syncing integrated data into `integration_backups`, browsing backed-up data, creating custom folders, and tracking sync history.
- **Memory Engine**: Implements a lifelong persistent context memory system (`src/lib/memoryEngine.ts`) storing events, decisions, and predictions in the `org_memory` Supabase table. It includes pattern recognition and prediction generation capabilities.
- **Creator Lab**: A private, creator-only interface for advanced management, including a Prompt Console for structured change proposals, a UI Builder for dashboard customization, access tier management, memory management, and system configuration.
- **Tier System**: Manages different user access tiers (`free|solo|growth|command|enterprise`), including fetching definitions, saving definitions, and managing user grants.
- **Team Members Management**: A dedicated page at `/members` (`src/pages/Members.tsx`) for workspace owners to invite, view, edit roles, and remove team members. Backed by a `workspace_members` table (via `server/memberSchema.ts`) with Express API routes in `server/memberRoutes.ts` (`GET/POST/PUT/DELETE /api/members`). Enforces tier-based seat limits (Free=1, Solo=5, Growth=15, Command=50, Enterprise=unlimited). Members have roles: owner, admin, manager, member, viewer. Includes a "Copy Invite Link" feature and soft-remove (status=removed) pattern.
- **CRM Lead Discovery**: The discovery engine in `server/crmDiscoveryService.ts` + `server/crmWebCrawler.ts` now handles DuckDuckGo search results that are listicle/directory pages (Top N Companies lists) rather than direct company websites. `isListiclePage()` detects these pages and `extractCompanyLinksFromListicle()` parses them to extract actual company URLs, which are then crawled directly. This two-pass approach recovers real company websites from blog-style lists.
- **Personalization**: `CompanyProfile` (in `src/lib/companyStore.ts`) includes `font`, `density`, and `fontSize` fields. Helper functions `applyFont()`, `applyDensity()`, and `applyFontSize()` apply these at runtime. The Admin customize tab (`/admin` → Customize tab) exposes all three as button-group selectors (Font Family: Inter/Mono/Rounded; Text Size: Small/Medium/Large; Layout Density: Compact/Normal/Spacious) plus the accent hue slider. Preferences are applied on startup in `src/App.tsx`.
- **Migration Hub**: A wizard at `/migrate` for importing data from various project management tools (Asana, Trello, ClickUp, Jira, Notion, Generic CSV) into `action_items` with auto-mapping and status normalization.
- **Starred Nav / Shortcuts**: Allows users to star navigation items for quick access, persisted in `localStorage`.
- **AI Note Taker**: A tiered feature at `/note-taker` for capturing meeting notes, transcribing voice-to-text, and generating AI summaries of decisions and action items.
- **Data Services**: `supabaseDataService.ts` centralizes all Supabase CRUD operations.
- **Project Structure**: Organized into `pages/`, `components/`, `hooks/`, `lib/`, and `integrations/supabase/`.

## External Dependencies
- **Supabase**: Authentication, PostgreSQL Database, Realtime subscriptions.
- **React**: Frontend UI library.
- **Vite**: Build tool and development server.
- **TypeScript**: For type safety.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Component library.
- **React Router v6**: Client-side routing.
- **React Query**: Data-fetching and state management.
- **Recharts**: Charting library.
# Tech-Ops by Martin PMO

## Overview

"Tech-Ops by Martin PMO" is a full-stack autonomous technology operations platform powered by the "Apphia Engine". It is designed to streamline and automate IT operations, diagnostics, and knowledge management for businesses. The platform offers capabilities for hosting, secure remote access, encrypted document storage, intelligent recommendations, and comprehensive analytics. The Apphia Engine is a knowledge system — never referred to as "AI", "assistant", or "bot".

**Tagline**: "Support, Engineered."

## User Preferences

- **Brand**: "Tech-Ops by Martin PMO" — Apphia is the knowledge system/engine, never called "AI", "assistant", or "bot".
- **Design**: Light theme — white/slate-50 backgrounds, blue/indigo accent colors, clean card shadows. No dark backgrounds anywhere.
- **No character/size limits** on any inputs.
- **No Zod `max()` constraints** anywhere.
- **No Stripe** — payment providers are UI-only: Zoho, Billsby, Chargebee, Fastspring, Square.

## System Architecture

The project is built as a pnpm workspace monorepo using Node.js 24 and TypeScript 5.9.

**Core Technologies:**
- **Backend**: Express 5, tsx (hot-reload dev)
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Database**: PostgreSQL with Drizzle ORM + pgvector + pg_trgm
- **Authentication**: Custom multi-method auth (Google OAuth + Email/Password + Email Magic Link)
- **Validation**: Zod (v4), `drizzle-zod`
- **Payments**: UI-only billing page (Zoho, Billsby, Chargebee, Fastspring, Square — no Stripe)

**Monorepo Structure:**
- `artifacts/api-server/` — Express API server (port 8080)
- `artifacts/techops/` — React + Vite frontend
- `lib/db/` — Drizzle ORM schema and migrations
- `lib/api-zod/` — Generated Zod schemas (exports from source, no build step)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/replit-auth-web/` — useAuth hook (exports from source, no build step)

## Authentication

**Replaced Replit OIDC** with custom 3-method auth:

| Method | Endpoint | Notes |
|--------|----------|-------|
| Google OAuth | `GET /api/auth/google` | Requires `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` |
| Email + Password | `POST /api/auth/register`, `POST /api/auth/login` | bcryptjs hashing |
| Magic Link | `POST /api/auth/magic-link/request`, `GET /api/auth/magic-link/verify` | Nodemailer; returns `devLink` in dev mode |
| Session user | `GET /api/auth/user` | Returns `{ user }` or `{ user: null }` |
| Creator Mode | `POST /api/auth/creator-login` | Key: `CREATOR_KEY` env var (default: `TechOpsPMO-Creator-2025`) |
| Logout | `POST /api/auth/logout` | Clears `sid` cookie |

**Session**: cookie `sid`, stored in `sessions` table, TTL 7 days.
**Auth UI**: `/auth` page — 3 tabs (Google / Password / Magic Link) + hidden Creator Mode (Crown icon link at bottom). Light theme with PMO-Ops logo. Registration has ToS checkbox.

**Env vars needed for full auth:**
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_PORT` (Magic Link email)

## Database Schema

Key columns added via `ALTER TABLE` (raw SQL):
- `users.notification_preferences` (jsonb) — email/alert/digest preferences
- `users.onboarding_completed` (boolean) — first-login wizard
- `users.cookie_consent` (boolean) — GDPR consent

DB command: `psql $DATABASE_URL -c "ALTER TABLE..."` for non-interactive additions.
Drizzle push: `pnpm --filter @workspace/db run push` (interactive; use force flag for conflicts).

## Key Pages & Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page with social proof, stats, testimonials |
| `/auth` | Public | 3-tab auth page with ToS checkbox |
| `/privacy` | Public | Privacy Policy |
| `/terms` | Public | Terms of Service |
| `/status` | Public | Live platform health status |
| `/dashboard` | Protected | Case stats, ticket queue |
| `/cases` | Protected | Support ticket list |
| `/cases/submit` | Protected | New case form |
| `/billing` | Protected | 4-tier subscription page (UI-only) |
| `/hosting` | Protected | App/web project hosting |
| `/admin` | Admin only | User mgmt, platform stats, KB admin |
| `/security` | Protected | Security dashboard |
| `/pmo-ops` | Protected | PMO efficiency dashboard |
| `/stack-intelligence` | Protected | Stack analysis + recommendations |
| `/voice` | Protected | Voice companion (Apphia) |
| `/analytics` | Pro+ | Analytics dashboard |
| `/connectors` | Protected | Connector health |
| `/automation` | Protected | Automation Center |
| `/batches` | Protected | Batch diagnostics |
| `/alerts` | Protected | System alerts |
| `/kb` | Protected | Knowledge base |
| `/secure-vault` | Protected | Encrypted document vault |
| `/remote-assistance` | Protected | Remote control sessions |
| `/settings` | Protected | User settings (profile, password, notifications) |
| `/apphia/chat` | Protected | Apphia chat interface |

## Key Features

1. **Apphia Knowledge Graph**: pgvector (1536-dim) + pg_trgm semantic search KB.
2. **12-Stage Diagnostic Pipeline**: Streams via SSE. RAG retrieval, root cause ranking, resolution synthesis.
3. **Batch Diagnostics**: Tier-based concurrency, pause/cancel, cross-case pattern detection.
4. **Tier Gating + RBAC**: `tierGating.ts` middleware, roles: owner/admin/viewer.
5. **Secure Hosting**: Project CRUD, domain management, SSL status.
6. **Encrypted Screenshare**: AES-256-GCM sessions with audit log.
7. **Company Vault**: scrypt key derivation, AES-256-GCM document storage.
8. **PMO Dashboard**: Resolution rate, SLA compliance, batch savings from real cases data.
9. **Security Dashboard**: Score from audit log, alert severity, SLA breach rate, connector health.
10. **Stack Intelligence**: Environment snapshots + connector health → Apphia recommendations.
11. **Voice Companion**: Push-to-talk → Apphia text response → browser TTS.
12. **Admin Panel**: User list + tier/role mgmt, platform stats, KB admin.
13. **Analytics Dashboard**: Recharts multi-tab dashboard (overview, cases, pipeline, errors).
14. **Remote Control**: Permission-scoped sandbox with command guardrails and audit log.
15. **AlertMonitor**: Runs every 10 min — connector health degradation + SLA approaching/breach + critical-case-undiagnosed checks.
16. **AutomationEngine**: Runs every 5 min — evaluates automation rules and triggers actions.
17. **Onboarding Wizard**: 4-step modal (Welcome → Snapshot → Connect → Preferences) shown after first login.
18. **Cookie Consent**: GDPR-compliant banner with localStorage persistence.
19. **Demo Mode**: `POST /api/demo/session` creates a temporary demo user with seeded case data. Landing page has "Try Demo" button.
20. **Rate Limiting**: Auth endpoints: login=5/min, register=3/min, magic-link=3/min, demo=5/min.
21. **Error Boundary**: React error boundary wrapping all routes for graceful crash recovery.
22. **Mobile Sidebar**: Collapsible sidebar on mobile (<lg) with hamburger menu + overlay.

## External Dependencies

- **OpenAI**: Apphia Engine (GPT-4o), voice processing (via AI_INTEGRATIONS_OPENAI env vars)
- **PostgreSQL extensions**: `pgvector`, `pg_trgm`
- **Nodemailer**: Magic link emails (optional — dev mode returns link directly)
- **Google OAuth**: Social login (requires `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`)

## DB Commands

```bash
pnpm --filter @workspace/db run push        # Sync schema (interactive)
psql $DATABASE_URL -c "ALTER TABLE ..."     # Non-interactive column adds
cd lib/db && npx tsc -p tsconfig.json       # Rebuild TS types for DB package
```
