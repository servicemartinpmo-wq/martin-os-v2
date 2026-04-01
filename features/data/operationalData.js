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

export const pmoPortfolioLanes = [
  {
    lane: 'Strategy',
    owner: 'Office of the COO',
    score: 91,
    trend: '+4',
    focus: 'Roadmap and sequencing',
  },
  {
    lane: 'Finance',
    owner: 'Finance Ops',
    score: 84,
    trend: '-2',
    focus: 'Variance and collections',
  },
  {
    lane: 'Delivery',
    owner: 'Program Delivery',
    score: 88,
    trend: '+3',
    focus: 'Milestones and blockers',
  },
  {
    lane: 'Governance',
    owner: 'PMO Council',
    score: 79,
    trend: '-1',
    focus: 'Decision cadence and approvals',
  },
]

export const pmoDecisionBacklog = [
  {
    id: 'DEC-221',
    title: 'Approve Q3 migration budget',
    category: 'Budget',
    decisionBy: '2026-04-03',
    impact: 'high',
  },
  {
    id: 'DEC-225',
    title: 'Consolidate integration vendor stack',
    category: 'Architecture',
    decisionBy: '2026-04-06',
    impact: 'medium',
  },
  {
    id: 'DEC-228',
    title: 'Re-sequence customer portal launch',
    category: 'Timeline',
    decisionBy: '2026-04-08',
    impact: 'high',
  },
  {
    id: 'DEC-230',
    title: 'Adopt shared design QA checklist',
    category: 'Quality',
    decisionBy: '2026-04-10',
    impact: 'medium',
  },
]

export const techOpsSlaBoard = [
  { label: 'P1 response', target: '15m', actual: '11m', state: 'healthy' },
  { label: 'P2 response', target: '1h', actual: '54m', state: 'healthy' },
  { label: 'P1 resolution', target: '4h', actual: '4h 38m', state: 'warning' },
  { label: 'Escalation acknowledgement', target: '10m', actual: '7m', state: 'healthy' },
]

export const techConnectorHealth = [
  { name: 'GitHub', uptime: 99.94, lagMs: 220, state: 'healthy' },
  { name: 'Intercom', uptime: 98.72, lagMs: 1350, state: 'warning' },
  { name: 'Slack', uptime: 99.88, lagMs: 310, state: 'healthy' },
  { name: 'Stripe', uptime: 99.12, lagMs: 870, state: 'healthy' },
  { name: 'PagerDuty', uptime: 97.44, lagMs: 2100, state: 'critical' },
]

export const techWorkflowRuns = [
  {
    id: 'WF-9031',
    workflow: 'Ticket Intake',
    stage: 'classification',
    eta: '00:21',
    state: 'running',
  },
  {
    id: 'WF-9030',
    workflow: 'Escalation',
    stage: 'owner_notified',
    eta: '00:08',
    state: 'running',
  },
  {
    id: 'WF-9028',
    workflow: 'Knowledge Update',
    stage: 'kb_upserted',
    eta: 'done',
    state: 'completed',
  },
  {
    id: 'WF-9022',
    workflow: 'Connector Sync',
    stage: 'retry_backoff',
    eta: '02:10',
    state: 'warning',
  },
]

export const miidleTimeline = [
  {
    id: 'MID-781',
    channel: 'Capture',
    event: 'Portal launch retro imported from 4 workstreams',
    actor: 'Story engine',
    time: '09:14',
    state: 'published',
  },
  {
    id: 'MID-783',
    channel: 'Work Graph',
    event: 'Dependency bridge linked between Tech-Ops and PMO milestone',
    actor: 'Ops analyst',
    time: '10:02',
    state: 'updated',
  },
  {
    id: 'MID-786',
    channel: 'Narrative',
    event: 'Executive digest rendered with confidence annotations',
    actor: 'AI copilot',
    time: '10:41',
    state: 'queued',
  },
  {
    id: 'MID-792',
    channel: 'Evidence',
    event: 'Runbook clips and issue timeline packaged for stakeholders',
    actor: 'Delivery lead',
    time: '11:18',
    state: 'published',
  },
]

export const fallbackCrmCompanies = [
  {
    id: 'co-1',
    name: 'Northstar Health Group',
    industry: 'Healthcare',
    status: 'Warm',
    lead_score: 91,
    city: 'Atlanta',
    state: 'GA',
    website: 'northstarhealth.example',
  },
  {
    id: 'co-2',
    name: 'Brightlane Commerce',
    industry: 'Retail Tech',
    status: 'Qualified',
    lead_score: 84,
    city: 'Austin',
    state: 'TX',
    website: 'brightlane.example',
  },
  {
    id: 'co-3',
    name: 'Verde Advisory',
    industry: 'Consulting',
    status: 'Proposal',
    lead_score: 76,
    city: 'Chicago',
    state: 'IL',
    website: 'verde.example',
  },
]

export const fallbackCrmContacts = [
  {
    id: 'ct-1',
    company_id: 'co-1',
    first_name: 'Maya',
    last_name: 'Reed',
    title: 'COO',
    direct_email: 'maya@northstarhealth.example',
    phone: '(404) 555-0112',
    confidence: 'high',
  },
  {
    id: 'ct-2',
    company_id: 'co-2',
    first_name: 'Jon',
    last_name: 'Patel',
    title: 'VP Operations',
    direct_email: 'jon@brightlane.example',
    phone: '(512) 555-0143',
    confidence: 'medium',
  },
  {
    id: 'ct-3',
    company_id: 'co-3',
    first_name: 'Elena',
    last_name: 'Price',
    title: 'Founder',
    direct_email: 'elena@verde.example',
    phone: '(312) 555-0179',
    confidence: 'high',
  },
]

export const fallbackCrmOpportunities = [
  {
    id: 'opp-1',
    name: 'Northstar onboarding rollout',
    stage: 'proposal',
    value: 42000,
    probability: 72,
    company: 'Northstar Health Group',
    expectedCloseDate: '2026-04-15',
  },
  {
    id: 'opp-2',
    name: 'Brightlane process redesign',
    stage: 'qualified',
    value: 28000,
    probability: 54,
    company: 'Brightlane Commerce',
    expectedCloseDate: '2026-04-28',
  },
  {
    id: 'opp-3',
    name: 'Verde advisory retainer',
    stage: 'negotiation',
    value: 18000,
    probability: 81,
    company: 'Verde Advisory',
    expectedCloseDate: '2026-04-08',
  },
]

export const fallbackAdvisors = [
  {
    id: 'strategy',
    name: 'Strategy Guide',
    category: 'Core',
    response_time: '24 hrs',
    focus: 'Goals, priorities, and choosing where to put attention next.',
    status: 'Available',
  },
  {
    id: 'operations',
    name: 'Operations Guide',
    category: 'Core',
    response_time: '24 hrs',
    focus: 'Workflows, bottlenecks, and making delivery smoother.',
    status: 'Busy',
  },
  {
    id: 'finance',
    name: 'Finance Guide',
    category: 'Optional',
    response_time: '48 hrs',
    focus: 'Cash flow, planning, and understanding what the numbers are saying.',
    status: 'Available',
  },
  {
    id: 'marketing',
    name: 'Growth Guide',
    category: 'Optional',
    response_time: '48 hrs',
    focus: 'Customer growth, messaging, and getting more from demand efforts.',
    status: 'Available',
  },
]

export const fallbackAdvisoryRequests = [
  {
    id: 'req-1',
    advisor_id: 'strategy',
    title: 'Prioritize Q2 goals',
    priority: 'High',
    status: 'In review',
    due_date: '2026-04-02',
  },
  {
    id: 'req-2',
    advisor_id: 'operations',
    title: 'Reduce approval delays',
    priority: 'Medium',
    status: 'Scheduled',
    due_date: '2026-04-05',
  },
]

export const fallbackMeetings = [
  {
    id: 'mtg-1',
    title: 'Weekly leadership sync',
    date: '2026-03-31',
    time: '09:00 AM',
    duration: 45,
    type: 'video',
    status: 'Upcoming',
  },
  {
    id: 'mtg-2',
    title: 'Client project review',
    date: '2026-04-01',
    time: '01:30 PM',
    duration: 30,
    type: 'call',
    status: 'Upcoming',
  },
]

export const fallbackMeetingActionItems = [
  {
    id: 'act-1',
    meeting_id: 'mtg-1',
    task: 'Confirm owner for onboarding automation',
    assignee: 'Program Delivery',
    due_date: '2026-04-02',
    priority: 'High',
    confidence: 0.92,
  },
  {
    id: 'act-2',
    meeting_id: 'mtg-2',
    task: 'Send updated scope and budget to client',
    assignee: 'Account Lead',
    due_date: '2026-04-03',
    priority: 'Medium',
    confidence: 0.88,
  },
]

export const fallbackSystemAlerts = [
  {
    id: 'alt-1',
    title: 'PagerDuty response time is climbing',
    severity: 'warning',
    acknowledged: false,
    created_at: '2026-03-28T09:15:00Z',
    detail: 'Average response delay rose above the target window in the last hour.',
  },
  {
    id: 'alt-2',
    title: 'Intercom sync retried twice',
    severity: 'info',
    acknowledged: true,
    created_at: '2026-03-28T08:42:00Z',
    detail: 'The retry completed successfully, but the connector should be monitored.',
  },
  {
    id: 'alt-3',
    title: 'Critical escalation waiting for review',
    severity: 'critical',
    acknowledged: false,
    created_at: '2026-03-28T07:58:00Z',
    detail: 'A tier-three escalation is still unassigned after the expected handoff window.',
  },
]

export const fallbackKnowledgeEntries = [
  {
    id: 'kb-1',
    domain: 'support',
    title: 'How to recover a stalled connector',
    description: 'Step-by-step recovery process for delayed or partially failed app syncs.',
    type: 'playbook',
    confidence_score: 0.93,
    estimated_time: '12 min',
    tags: ['connectors', 'recovery', 'sync'],
  },
  {
    id: 'kb-2',
    domain: 'support',
    title: 'How to route urgent requests correctly',
    description: 'Simple routing rules for deciding when to escalate and who should own the next step.',
    type: 'guide',
    confidence_score: 0.89,
    estimated_time: '6 min',
    tags: ['routing', 'escalation', 'triage'],
  },
  {
    id: 'kb-3',
    domain: 'planning',
    title: 'How to turn meeting notes into action items',
    description: 'A practical checklist for turning notes, decisions, and risks into follow-through.',
    type: 'workflow',
    confidence_score: 0.84,
    estimated_time: '8 min',
    tags: ['meetings', 'follow-through', 'actions'],
  },
]

export const miidleNarrativeTemplates = [
  {
    id: 'exec-pulse',
    label: 'Executive Pulse',
    output: '3-minute briefing and one-page summary',
    latency: '2m',
  },
  {
    id: 'delivery-review',
    label: 'Delivery Review',
    output: 'Milestone status and dependency map',
    latency: '4m',
  },
  {
    id: 'incident-story',
    label: 'Incident Story',
    output: 'Root cause chain and recovery timeline',
    latency: '6m',
  },
]
