export const quarterlyReportData = [
  { quarter: 'Q1', health: 72, initiativeVelocity: 61, variance: 4.8, incidents: 19 },
  { quarter: 'Q2', health: 76, initiativeVelocity: 68, variance: 3.6, incidents: 14 },
  { quarter: 'Q3', health: 81, initiativeVelocity: 74, variance: 3.1, incidents: 11 },
  { quarter: 'Q4', health: 84, initiativeVelocity: 79, variance: 2.9, incidents: 9 },
]

/** Aligned to Tech-Ops / Apphia readiness: SSE diagnostic case pipeline (stage labels). */
export const caseDiagnosticPipelineStages = [
  'Intake',
  'Classify',
  'Context build',
  'Hypothesis',
  'Evidence gather',
  'Tier scoring',
  'Routing',
  'Playbook attach',
  'Resolution draft',
  'Human review',
  'Closure',
  'Learning export',
]

export const workflowStateContracts = [
  {
    name: 'Ticket Intake',
    states: ['received', 'classified', 'tier_assigned', 'queued'],
    retries: 'max 2',
    fallback: 'manual triage queue',
  },
  {
    name: 'Escalation',
    states: ['threshold_hit', 'escalated', 'owner_notified', 'sla_tracking'],
    retries: 'max 3',
    fallback: 'exec escalation channel',
  },
  {
    name: 'Knowledge Update',
    states: ['ticket_closed', 'pattern_extracted', 'kb_upserted', 'confidence_recalc'],
    retries: 'max 1',
    fallback: 'deferred learning batch',
  },
]

export const miidleCaptureFeed = [
  { mode: 'builder', time: '09:10', title: 'Scope refinement checkpoint', detail: 'Initiative scope changed with rationale and decision hash.' },
  { mode: 'builder', time: '11:00', title: 'Implementation event', detail: 'Workflow patch merged and linked to proof-of-work record.' },
  { mode: 'spectator', time: '12:30', title: 'Milestone highlight', detail: 'Public-safe progress card published to spectator timeline.' },
  { mode: 'builder', time: '14:20', title: 'Risk intervention', detail: 'Dependency warning captured with owner assignment.' },
  { mode: 'spectator', time: '16:05', title: 'Daily recap', detail: 'Narrative recap generated from execution graph.' },
]

export const fallbackDiagnosticsSignals = [
  { id: 'sig-1', area: 'Capacity utilization', state: 'Warning', detail: 'Program Delivery at 94% load; scope deferral recommended.' },
  { id: 'sig-2', area: 'Governance thresholds', state: 'Warning', detail: 'Three initiatives missing board-level approval triggers.' },
  { id: 'sig-3', area: 'Risk register hygiene', state: 'Healthy', detail: 'Most active initiatives have current risk logs.' },
  { id: 'sig-4', area: 'Execution discipline', state: 'Critical', detail: 'Action-item completion rate below target benchmark.' },
]

/** Stable `insights`-shaped rows for hooks that expect `signal` (red/yellow/green). */
export const fallbackInsightRecords = [
  {
    id: 'sig-1',
    type: 'Capacity',
    signal: 'yellow',
    summary: fallbackDiagnosticsSignals[0].detail,
    situation: fallbackDiagnosticsSignals[0].detail,
  },
  {
    id: 'sig-2',
    type: 'Governance',
    signal: 'yellow',
    summary: fallbackDiagnosticsSignals[1].detail,
    situation: fallbackDiagnosticsSignals[1].detail,
  },
  {
    id: 'sig-3',
    type: 'Risk register',
    signal: 'green',
    summary: fallbackDiagnosticsSignals[2].detail,
    situation: fallbackDiagnosticsSignals[2].detail,
  },
  {
    id: 'sig-4',
    type: 'Execution',
    signal: 'red',
    summary: fallbackDiagnosticsSignals[3].detail,
    situation: fallbackDiagnosticsSignals[3].detail,
  },
]

/** Stable empty fallback for optional Supabase tables (avoid `[]` in render). */
export const emptyTableFallback = Object.freeze([])

export const fallbackPmoInitiatives = [
  {
    id: 'ini-1',
    name: 'Client Portal v2',
    status: 'On Track',
    priority: 82,
    alignment: 88,
    risk: 22,
    completion: 64,
    priority_score: 82,
    strategic_alignment: 88,
    dependency_risk: 22,
    completion_pct: 64,
    owner: 'Program Delivery',
  },
  {
    id: 'ini-2',
    name: 'Finance Close Automation',
    status: 'At Risk',
    priority: 76,
    alignment: 80,
    risk: 48,
    completion: 41,
    priority_score: 76,
    strategic_alignment: 80,
    dependency_risk: 48,
    completion_pct: 41,
    owner: 'Finance Ops',
  },
  {
    id: 'ini-3',
    name: 'Governance Policy Refresh',
    status: 'Delayed',
    priority: 63,
    alignment: 71,
    risk: 57,
    completion: 29,
    priority_score: 63,
    strategic_alignment: 71,
    dependency_risk: 57,
    completion_pct: 29,
    owner: 'Admin Systems',
  },
  {
    id: 'ini-4',
    name: 'Cross-Team SOP Rollout',
    status: 'On Track',
    priority: 72,
    alignment: 79,
    risk: 30,
    completion: 58,
    priority_score: 72,
    strategic_alignment: 79,
    dependency_risk: 30,
    completion_pct: 58,
    owner: 'Operations',
  },
]

export const fallbackTechTickets = [
  { id: 'TK-1402', title: 'API timeout on auth callback', tier: 3, confidence: 0.82, status: 'Open' },
  { id: 'TK-1407', title: 'Slack integration sync stale', tier: 2, confidence: 0.71, status: 'Investigating' },
  { id: 'TK-1411', title: 'Billing webhook retries', tier: 4, confidence: 0.43, status: 'Escalated' },
  { id: 'TK-1413', title: 'Knowledge article mismatch', tier: 1, confidence: 0.9, status: 'Resolved' },
]

/** Tech-Ops: Supabase table `ai_diagnostics` (check_label, metric_value, detail, acknowledged). */
export const fallbackAiDiagnostics = [
  { id: 'diag-1', check_label: 'AI classifier health', metric_value: '97.2%', detail: 'Input classifier confidence within target range.', acknowledged: false },
  { id: 'diag-2', check_label: 'Escalation trigger lag', metric_value: '1.4s', detail: 'Within SLA; no missed escalation events.', acknowledged: false },
  { id: 'diag-3', check_label: 'Knowledge update success', metric_value: '88%', detail: 'Closed-ticket learning writes are stable.', acknowledged: false },
  { id: 'diag-4', check_label: 'Integration sync reliability', metric_value: '92%', detail: 'One source intermittently delayed.', acknowledged: false },
]

/** Miidle: Supabase table `story_jobs`. */
export const fallbackStoryJobs = [
  { id: 'job-1', name: 'Weekly Build Recap', format: 'Video + summary', status: 'Queued', source: 'Execution stream' },
  { id: 'job-2', name: 'Incident-to-Learning', format: 'Article', status: 'Rendering', source: 'Tech-Ops closure logs' },
  { id: 'job-3', name: 'Proof-of-Work Portfolio', format: 'Deck', status: 'Published', source: 'Initiatives + artifacts' },
]

/** Miidle: Supabase table `story_artifacts` (title, state, audience). */
export const fallbackStoryArtifacts = [
  { id: 'art-1', title: 'Build recap video', state: 'Ready', audience: 'Executive + team' },
  { id: 'art-2', title: 'Narrative article', state: 'Drafted', audience: 'Internal knowledge base' },
  { id: 'art-3', title: 'Portfolio proof card', state: 'Published', audience: 'External profile' },
  { id: 'art-4', title: 'Timeline storyboard', state: 'Queued', audience: 'Spectator feed' },
]
