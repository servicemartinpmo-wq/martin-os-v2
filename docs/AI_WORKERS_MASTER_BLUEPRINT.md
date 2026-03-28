# AI Workers Master Blueprint (miiddle + PMO-Ops + Tech-Ops)

## 0. Purpose and scope

This document converts the product blueprint into an implementation-level AI Worker system that is immediately buildable on top of the existing Brain Layer assets.

It is intentionally additive to:
- `docs/brain-layer-implementation-guide.md`
- `docs/claude-brain-layer-prompt-package.md`
- `mpo-pilot-main/supabase/migrations/20260327000001_complete_brain_layer.sql`

This document focuses on:
- Worker topology and boundaries
- Event contracts and automation prompts
- Signal to workflow to recommendation pipelines
- Supabase schema deltas needed for full Organizational Operating System behavior
- Monetization/entitlement hooks
- Delivery slices for phased rollout

## 1. Architecture anchor

## 1.1 Runtime stack

- Runtime edge: Cloudflare Workers
- Async orchestration: Cloudflare Queues + Durable Objects (workflow lock/state)
- Persistence: Supabase PostgreSQL + pgvector
- AI inference: provider abstraction (`openai`, `anthropic`, `cloudflare-ai`) via policy table
- Domain schemas: `pmo_ops`, `tech_ops`, `miiddle`
- Shared schema: `public` for org-level and cross-domain entities

## 1.2 Canonical data flow

`ingest -> detect_signal -> route_workflow -> diagnose -> recommend -> execute -> learn -> score_org_health -> notify`

All stages write machine artifacts to storage for:
- explainability
- replay
- benchmarking
- model/prompt tuning

## 2. Worker topology and responsibilities

## 2.1 Worker catalog

| Worker | Type | Primary responsibility | Input | Output |
|---|---|---|---|---|
| `brain-ingress-worker` | HTTP Worker | Auth, idempotency, tenant resolution, event normalization | API requests/events | canonical event envelope |
| `signal-detector-worker` | Queue consumer | Rules + model-assisted signal detection | canonical events + metrics | rows in `signals` + trigger records |
| `workflow-orchestrator-worker` | Durable Object + Queue | Deterministic workflow progression and state machine enforcement | signal IDs/workflow IDs | `workflow_runs`, execution tasks |
| `diagnostic-worker` | Queue consumer | Root cause diagnostics using framework stacks | workflow step payload | `diagnostics` |
| `advisory-worker` | Queue consumer | Recommendation generation and scoring | diagnostics + org context | `recommendations`, `action_items` |
| `execution-worker` | Queue consumer | Auto-execution, assignment, connector actions | actionable recommendations | updated entities + execution logs |
| `memory-learning-worker` | Scheduled + Queue | Outcome ingestion, trust/weight updates, prompt tuning stats | action outcomes + feedback | memory/outcome updates |
| `health-score-worker` | Scheduled | Org/department/initiative health scoring | graph snapshots + outcomes | `org_health_scores` |
| `briefing-worker` | Scheduled | Daily/weekly briefings by mode/role | health + risks + actions | digest artifacts |
| `integration-bridge-worker` | HTTP + Queue | Connector webhooks (Slack/GitHub/Google/etc.) | external events | canonical events |

## 2.2 Domain-specialized worker packs

Each domain uses same core workers plus domain policies.

### `pmo_ops` pack
- `pmo_signal_policy_v1`: milestone variance, backlog growth, dependency blockage
- `pmo_diagnostic_frameworks`: PMBOK + TOC + risk register
- `pmo_recovery_playbooks`: schedule recovery, scope tradeoff, staffing rebalance

### `tech_ops` pack
- `tech_signal_policy_v1`: incident spikes, SLA burn, alert storms, deployment instability
- `tech_diagnostic_frameworks`: SRE incident, cause tree, change failure analysis
- `tech_recovery_playbooks`: rollback, runbook execution, paging/assignment

### `miiddle` pack
- `miiddle_signal_policy_v1`: campaign decay, lead stagnation, conversion regression
- `miiddle_diagnostic_frameworks`: funnel analysis, channel attribution, content-fit analysis
- `miiddle_recovery_playbooks`: budget redistribution, cadence change, creative test plans

## 3. Canonical event and automation contracts

## 3.1 Canonical event envelope

```json
{
  "event_id": "uuid",
  "idempotency_key": "string",
  "occurred_at": "iso8601",
  "received_at": "iso8601",
  "tenant": {
    "organization_id": "uuid",
    "profile_id": "uuid",
    "domain": "pmo_ops|tech_ops|miiddle"
  },
  "source": {
    "system": "ui|api|github|slack|calendar|ehr|erp|scheduler",
    "source_event_type": "string",
    "trace_id": "string"
  },
  "payload": {},
  "context": {
    "mode": "founder|executive|assisted|project|freelance|creative|healthcare",
    "feature_flags": {},
    "entitlements": []
  }
}
```

## 3.2 Signal contract

```json
{
  "signal_id": "uuid",
  "entity_type": "organization|department|initiative|project|task|kpi|team",
  "entity_id": "uuid",
  "domain": "pmo_ops|tech_ops|miiddle",
  "signal_type": "operational|strategic|behavioral|risk",
  "signal_code": "missed_deadline|kpi_decline|overcapacity_team|incident_spike|funnel_drop",
  "severity": 0,
  "confidence_score": 0.0,
  "reason_codes": ["string"],
  "evidence": {},
  "status": "new|processed|dismissed|escalated",
  "triggered_at": "iso8601"
}
```

## 3.3 Workflow contract

```json
{
  "workflow_id": "string",
  "workflow_version": "semver",
  "domain": "pmo_ops|tech_ops|miiddle",
  "trigger_signal_codes": ["string"],
  "steps": [
    {
      "step_id": "string",
      "step_type": "rule|ai_diagnose|ai_advise|execute|notify|await_human",
      "timeout_seconds": 60,
      "max_retries": 3,
      "fallback_step_id": "string|null"
    }
  ],
  "priority_score_formula": "string",
  "auto_execute_threshold": 0.8
}
```

## 3.4 State machine (strict)

States:
- `queued`
- `running`
- `waiting_review`
- `retrying`
- `completed`
- `failed`
- `fallback`

Transitions:
- `queued -> running`
- `running -> waiting_review|retrying|completed|failed|fallback`
- `waiting_review -> running|completed|failed`
- `retrying -> running|failed|fallback`
- `failed -> fallback`

Retry:
- `retry_delay_seconds(attempt_n) = base_delay * (2^(attempt_n-1))`
- `base_delay = 1`

## 4. AI worker prompt system

## 4.1 Prompt asset model

Store prompts as versioned data, not hardcoded strings.

Table family:
- `ai_prompt_templates`
- `ai_prompt_versions`
- `ai_prompt_eval_runs`

Prompt type enum:
- `classification`
- `diagnostic`
- `advisory`
- `briefing`
- `summarization`
- `risk_forecast`

## 4.2 Diagnostic worker prompt IO

Input:
- signal snapshot
- entity graph neighborhood
- historical outcomes for same signal code
- active constraints (budget/capacity/policy)

Output JSON contract:
```json
{
  "diagnosis_id": "uuid",
  "root_causes": [
    {
      "level": "surface|immediate|systemic|structural",
      "cause_code": "string",
      "explanation": "string",
      "confidence": 0.0
    }
  ],
  "counterfactuals": [
    {
      "action": "string",
      "expected_delta": {},
      "confidence": 0.0
    }
  ],
  "framework_scores": {},
  "overall_confidence": 0.0
}
```

## 4.3 Advisory worker prompt IO

Output JSON contract:
```json
{
  "recommendation_id": "uuid",
  "action_type": "quick_fix|structural|strategic",
  "title": "string",
  "rationale": "string",
  "impact_score": 0.0,
  "effort_score": 0.0,
  "risk_reduction_score": 0.0,
  "expected_roi": 0.0,
  "time_to_impact_days": 0,
  "owner_role": "string",
  "auto_execute_eligible": true,
  "confidence_score": 0.0
}
```

## 5. Database architecture additions (delta model)

Existing domain tables already cover core brain engines. Add the following for full operating system behavior.

## 5.1 Shared `public` tables

### `public.signals`
- `signal_id uuid pk`
- `organization_id uuid not null`
- `domain text not null`
- `entity_type text not null`
- `entity_id uuid not null`
- `signal_type text not null`
- `signal_code text not null`
- `severity numeric(5,2) not null`
- `confidence_score numeric(5,4) not null`
- `reason_codes jsonb not null default '[]'`
- `evidence jsonb not null default '{}'`
- `processed boolean not null default false`
- `triggered_at timestamptz not null default now()`

Indexes:
- `(organization_id, domain, triggered_at desc)`
- `(entity_type, entity_id, triggered_at desc)`
- `(signal_code, processed, triggered_at desc)`

### `public.diagnostics`
- `diagnosis_id uuid pk`
- `signal_id uuid references public.signals(signal_id)`
- `organization_id uuid not null`
- `domain text not null`
- `framework_bundle text not null`
- `root_causes jsonb not null`
- `counterfactuals jsonb not null`
- `confidence_score numeric(5,4) not null`
- `created_at timestamptz not null default now()`

### `public.recommendations`
- `recommendation_id uuid pk`
- `diagnosis_id uuid references public.diagnostics(diagnosis_id)`
- `organization_id uuid not null`
- `domain text not null`
- `action_type text not null`
- `title text not null`
- `rationale text not null`
- `impact_score numeric(5,2) not null`
- `effort_score numeric(5,2) not null`
- `risk_reduction_score numeric(5,2) not null`
- `expected_roi numeric(12,2)`
- `time_to_impact_days int`
- `owner_profile_id uuid`
- `auto_execute_eligible boolean not null default false`
- `confidence_score numeric(5,4) not null`
- `status text not null default 'new'`
- `created_at timestamptz not null default now()`

### `public.action_items`
- `action_id uuid pk`
- `recommendation_id uuid references public.recommendations(recommendation_id)`
- `organization_id uuid not null`
- `domain text not null`
- `assigned_to uuid`
- `due_date date`
- `priority text not null`
- `status text not null`
- `origin_signal_id uuid`
- `execution_payload jsonb not null default '{}'`
- `completed_at timestamptz`
- `created_at timestamptz not null default now()`

### `public.org_health_scores`
- `health_id uuid pk`
- `organization_id uuid not null`
- `score numeric(5,2) not null`
- `ops_score numeric(5,2) not null`
- `revenue_score numeric(5,2) not null`
- `product_score numeric(5,2) not null`
- `team_score numeric(5,2) not null`
- `contributing_signal_ids jsonb not null default '[]'`
- `computed_at timestamptz not null default now()`

### `public.decision_log`
- `decision_id uuid pk`
- `organization_id uuid not null`
- `domain text not null`
- `decision_context jsonb not null`
- `selected_option jsonb not null`
- `expected_outcome jsonb not null`
- `actual_outcome jsonb`
- `decision_accuracy numeric(5,4)`
- `logged_at timestamptz not null default now()`

### `public.experiments`
- `experiment_id uuid pk`
- `organization_id uuid not null`
- `domain text not null`
- `name text not null`
- `hypothesis text not null`
- `variant_a jsonb not null`
- `variant_b jsonb not null`
- `metric_definition jsonb not null`
- `status text not null`
- `started_at timestamptz`
- `ended_at timestamptz`
- `result_summary jsonb`

### `public.entitlements`
- `entitlement_id uuid pk`
- `organization_id uuid not null`
- `tier text not null`
- `feature_code text not null`
- `limit_value int`
- `enabled boolean not null default true`
- `effective_from timestamptz not null`
- `effective_to timestamptz`

## 5.2 Graph projection tables

### `public.entity_nodes`
- `node_id uuid pk`
- `organization_id uuid not null`
- `domain text not null`
- `node_type text not null`
- `node_ref_id uuid not null`
- `attributes jsonb not null default '{}'`

### `public.entity_edges`
- `edge_id uuid pk`
- `organization_id uuid not null`
- `domain text not null`
- `from_node_id uuid references public.entity_nodes(node_id)`
- `to_node_id uuid references public.entity_nodes(node_id)`
- `edge_type text not null`
- `weight numeric(5,4) default 1`
- `attributes jsonb not null default '{}'`

Required edges:
- `initiative -> department`
- `department -> organization`
- `project -> initiative`
- `task -> project`
- `task -> team`
- `signal -> entity`
- `recommendation -> signal`
- `action_item -> recommendation`
- `decision -> outcome`

## 5.3 RLS baseline

Apply RLS on all `public` extension tables using:
- org-scoped policy through `organization_members`
- service-role bypass for worker writes
- optional healthcare partition policy for PHI-tagged entities

Policy shape:
- read: user belongs to `organization_id`
- write: owner/admin or service role

## 6. Signal engine implementation map

## 6.1 Trigger classes

1. Event-driven signals
- task state changes
- milestone updates
- incident events
- CRM lead lifecycle events

2. Scheduled signals
- daily KPI variance scan
- weekly capacity scan
- monthly strategic drift scan

3. Streaming/integration signals
- GitHub deployment failures
- Slack urgency spikes
- campaign engagement anomalies

## 6.2 Detection policies (examples)

### Policy `pmo_milestone_delay_v1`
- IF `milestone_due_date < now` AND `status != completed`
- emit `missed_deadline`
- severity = min(100, days_overdue * 8)

### Policy `tech_incident_spike_v1`
- IF incidents in 60m > p95 baseline for weekday/hour
- emit `incident_spike`
- severity = zscore_to_percentile(z)

### Policy `miiddle_conversion_drop_v1`
- IF conversion_rate_7d < conversion_rate_30d * 0.75
- emit `funnel_drop`
- severity = (1 - (rate_7d / rate_30d)) * 100

## 7. Workflow library (initial)

## 7.1 PMO/Project workflows

- `wf_pmo_018_recovery_system`
- `wf_pmo_032_risk_register`
- `wf_pmo_035_initiative_health_diagnostics`
- `wf_pmo_capacity_rebalance_v1`
- `wf_pmo_dependency_unblock_v1`

## 7.2 Tech-Ops workflows

- `wf_tech_incident_triage_v1`
- `wf_tech_alert_noise_reduction_v1`
- `wf_tech_change_failure_recovery_v1`
- `wf_tech_sla_protection_v1`

## 7.3 miiddle workflows

- `wf_miiddle_campaign_recovery_v1`
- `wf_miiddle_lead_velocity_repair_v1`
- `wf_miiddle_content_mix_optimizer_v1`

## 7.4 Workflow output guarantees

Every completed workflow must persist:
- one `workflow_run`
- zero or more `diagnostics`
- at least one `recommendation` unless explicit `no_action` reason
- optional `action_items` for execution
- `memory_event` summary

## 8. Advisory scoring and auto-execution rules

## 8.1 Scoring formulas

`priority_score = 0.45*impact + 0.30*urgency + 0.25*strategic_alignment`

`execution_score = 0.40*confidence + 0.30*owner_capacity + 0.20*policy_safety + 0.10*time_sensitivity`

`auto_execute = execution_score >= threshold_by_tier`

Tier thresholds:
- Free: disabled
- Pro: `>= 0.92` (safe quick-fix only)
- Advanced: `>= 0.85`
- Enterprise: configurable (`0.75-0.90`) + approval policies

## 8.2 Guardrails

Never auto-execute when:
- confidence `< 0.70`
- missing owner and no fallback owner
- healthcare entity with PHI and no compliant policy path
- action touches budget over org threshold

## 9. User mode mapping and UX outputs

## 9.1 Mode to artifact mapping

| Mode | Primary worker outputs shown in UI |
|---|---|
| Founder/SMB | Daily brief, cashflow-risk alerts, top 5 action queue |
| Executive | Health score trends, top strategic risks, tradeoff matrix |
| Assisted | Simplified action cards (green/yellow/red), guided actions |
| Project | Milestone health, board-level blockers, dependency alerts |
| Freelance | lead/campaign actions, meeting scheduling recommendations |
| Creative | content performance diagnostics, next content experiments |
| Healthcare | compliance-safe action plans, restricted context views |

## 9.2 Notification policy

- Priority 1 (red): persistent until acknowledged
- Priority 2 (yellow): 15-second fade + digest retention
- Priority 3 (green/info): digest only

## 10. Integration strategy

## 10.1 Connectors and normalization

Normalized connector event types:
- `github.deployment_failed`
- `slack.channel_urgency_spike`
- `google.calendar.no_show_rate_high`
- `erp.cashflow_variance`
- `ehr.compliance_event`

All connectors pass through `integration-bridge-worker` into canonical envelope.

## 10.2 Integration write safety

- idempotency required for external callbacks
- dedupe window: 24h by `(source.system, source_event_type, external_event_id)`
- dead-letter queue for malformed payloads

## 11. Observability, SRE, and governance

## 11.1 Required telemetry

Emit per workflow run:
- `trace_id`
- `organization_id`
- `domain`
- `workflow_id`
- `state_transition`
- `latency_ms`
- `retry_count`
- `fallback_used`

## 11.2 SLO targets

- p95 signal detection latency < 10s
- p95 workflow completion (non-human review) < 120s
- recommendation generation success rate >= 99.0%
- cross-tenant leakage incidents = 0

## 11.3 Audit requirements

Audit every change to:
- recommendations
- action item status
- entitlement changes
- healthcare policy override attempts

## 12. Monetization hooks

## 12.1 Tier gates (enforced in workers)

| Tier | Worker-level entitlements |
|---|---|
| Free | read-only dashboards, max 20 signals/month, no auto-exec |
| Pro | full dashboards, workflow automation, capped AI runs/day |
| Advanced | diagnostics + cross-system advisory + moderate auto-exec |
| Enterprise | multi-org benchmarking, custom frameworks, policy-controlled auto-exec |

## 12.2 Billing metrics

Track per org:
- `ai_tokens_in`
- `ai_tokens_out`
- `workflow_runs_count`
- `auto_executions_count`
- `connector_calls_count`

Persist monthly snapshots for invoicing and upgrade prompts.

## 13. Security and compliance overlays

## 13.1 Baseline controls

- JWT auth for all ingress
- org-scoped RLS
- encrypted sensitive fields at rest
- KMS-backed secrets for connector credentials

## 13.2 Healthcare overlay

When `mode=healthcare` or entity has `phi=true`:
- route through HIPAA-compliant prompt/provider policy
- block non-compliant connectors
- force audit log capture for all read/write actions
- require explicit `minimum_necessary` context filter

## 14. Cloudflare ingestion and routing spec

## 14.1 Endpoint set

- `POST /brain/v2/events/ingest`
- `POST /brain/v2/signals/detect`
- `POST /brain/v2/workflows/trigger`
- `GET /brain/v2/workflows/{run_id}`
- `GET /brain/v2/recommendations/{id}`
- `POST /brain/v2/actions/execute`

Headers:
- `Authorization: Bearer <jwt>`
- `x-idempotency-key: <request_id>`
- `x-org-id: <organization_id>`
- `x-domain: pmo_ops|tech_ops|miiddle`

## 14.2 Queue routing keys

- `signals.detect.<domain>`
- `workflow.run.<domain>`
- `diagnostic.run.<domain>`
- `advisory.run.<domain>`
- `execution.run.<domain>`
- `memory.learn.<domain>`

## 15. Build order (implementation slices)

## 15.1 Slice A (ship first): Initiative Health Monitoring

Tables required:
- `initiatives`, `milestones` (existing domain tables)
- `public.signals`
- `public.workflow_runs` (or domain-equivalent)
- `public.diagnostics`
- `public.recommendations`

Signals:
- `missed_deadline`
- `milestone_delay`
- `backlog_growth`

Workflows:
- `wf_pmo_035_initiative_health_diagnostics`
- `wf_pmo_032_risk_register`
- `wf_pmo_018_recovery_system`

Exit criteria:
- signal emitted within 10s of milestone breach
- diagnosis + recommendation produced within 2 minutes
- action item generated with owner and due date

## 15.2 Slice B: Capacity + Bottleneck intelligence

- add capacity and team-load signals
- integrate human behavior indicators
- add constrained optimization recommendations

## 15.3 Slice C: Strategic alignment engine

- map initiatives to strategic objectives
- detect drift and opportunity costs
- provide executive tradeoff queue

## 15.4 Slice D: Full cross-domain optimization

- merge PMO, Tech, miiddle interactions via graph edges
- activate experimentation engine and model reweighting
- enable enterprise benchmarking features

## 16. Acceptance tests (must pass before production)

1. Determinism test
- same input + same context -> same workflow path and ranked recommendations

2. Idempotency test
- duplicate requests with same key do not duplicate signals/workflow runs

3. Tenant isolation test
- cross-org reads/writes denied by policy

4. Fallback test
- forced worker failure transitions to `fallback` with audit trail

5. Auto-exec safety test
- low-confidence recommendations never auto-execute

6. Healthcare policy test
- PHI-tagged actions only execute through compliant policy path

## 17. Engineering backlog starter pack

1. Create migration for shared extension tables in `public` (`signals`, `diagnostics`, `recommendations`, `action_items`, `org_health_scores`, `decision_log`, `experiments`, `entitlements`, graph tables).
2. Implement `brain-ingress-worker` with strict canonical envelope validation and idempotency cache.
3. Implement `signal-detector-worker` with three production policies (`pmo_milestone_delay_v1`, `tech_incident_spike_v1`, `miiddle_conversion_drop_v1`).
4. Implement `workflow-orchestrator-worker` with strict state machine and retry/fallback.
5. Implement `diagnostic-worker` + `advisory-worker` with structured JSON outputs and confidence bounds.
6. Implement `execution-worker` with entitlement checks and safety guardrails.
7. Add scheduled `health-score-worker` + `briefing-worker`.
8. Add observability dashboards and alerting for SLO metrics.
9. Add tier gating in worker middleware via `public.entitlements`.
10. Run full acceptance test suite per section 16.

---

This blueprint is the implementation contract for AI Workers across `miiddle`, `pmo_ops`, and `tech_ops`, aligned to current Brain Layer assets while extending them into a full organizational operating system.
