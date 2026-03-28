import type {
  ContextAgentSplit,
  ContextMemoryTag,
  ContextRow,
  ContextRoutingResult,
  K2WConstraints,
} from '../agents/types'

export const CONTEXT_TABLE_ROWS: ContextRow[] = [
  {
    id: 'technical',
    type: 'technical',
    label: 'Technical Context',
    description:
      'System architecture, dependencies, interfaces, and execution runtime.',
    keyQuestions: [
      'What inputs and outputs are required?',
      'Which dependencies can fail?',
      'How should workflow execution be instrumented?',
    ],
    keywords: ['error', 'api', 'system', 'runtime', 'workflow', 'integration'],
    priority: 'high',
  },
  {
    id: 'situational',
    type: 'situational',
    label: 'Situational Context',
    description:
      'Current objective, constraints, urgency, and fit-to-task tradeoffs.',
    keyQuestions: [
      'What is the immediate objective?',
      'What constraints matter most now?',
      'What sequence best matches current priorities?',
    ],
    keywords: ['goal', 'priority', 'urgent', 'constraint', 'deadline'],
    priority: 'high',
  },
  {
    id: 'ethical',
    type: 'ethical',
    label: 'Ethical Context',
    description:
      'Policy, fairness, risk exposure, and safeguards for high-stakes decisions.',
    keyQuestions: [
      'Could this workflow create harmful outcomes?',
      'Are safeguards and approvals in place?',
      'Does this align with policy and governance expectations?',
    ],
    keywords: ['compliance', 'policy', 'risk', 'ethical', 'governance'],
    priority: 'medium',
  },
  {
    id: 'historical',
    type: 'historical',
    label: 'Historical Context',
    description:
      'Past outcomes, prior decisions, and recurring patterns to preserve or avoid.',
    keyQuestions: [
      'What similar workflows worked before?',
      'What failed and why?',
      'Which historical constraints should remain in force?',
    ],
    keywords: ['history', 'previous', 'past', 'retro', 'legacy'],
    priority: 'medium',
  },
  {
    id: 'relational',
    type: 'relational',
    label: 'Relational Context',
    description:
      'Stakeholders, ownership boundaries, communication style, and influence dynamics.',
    keyQuestions: [
      'Who owns each decision point?',
      'Does language fit executive/client audiences?',
      'Are escalation paths explicit?',
    ],
    keywords: ['client', 'stakeholder', 'owner', 'executive', 'team'],
    priority: 'medium',
  },
  {
    id: 'environmental',
    type: 'environmental',
    label: 'Environmental Context',
    description:
      'External market, ecosystem shifts, and dependency volatility impacting execution.',
    keyQuestions: [
      'Which external signals can invalidate this plan?',
      'What market factors can change sequencing?',
      'Which dependencies require fallback branches?',
    ],
    keywords: ['market', 'external', 'vendor', 'ecosystem', 'volatility'],
    priority: 'low',
  },
]

function rowScore(input: string, row: ContextRow): number {
  const lower = input.toLowerCase()
  const keywordScore = row.keywords.reduce(
    (score, keyword) => (lower.includes(keyword) ? score + 1 : score),
    0,
  )
  const priorityScore =
    row.priority === 'high' ? 2 : row.priority === 'medium' ? 1 : 0
  return keywordScore + priorityScore
}

function forcedRows(input: string, constraints?: K2WConstraints): ContextRow['type'][] {
  const lower = input.toLowerCase()
  const forced = new Set<ContextRow['type']>(['technical', 'situational'])

  if (
    constraints?.priority === 'high' ||
    lower.includes('high-stakes') ||
    lower.includes('compliance') ||
    lower.includes('policy')
  ) {
    forced.add('ethical')
  }
  if (lower.includes('client') || lower.includes('executive')) forced.add('relational')
  if (lower.includes('history') || lower.includes('previous')) forced.add('historical')
  if (lower.includes('market') || lower.includes('external')) forced.add('environmental')

  return Array.from(forced)
}

export function contextCheck(
  input: string,
  constraints?: K2WConstraints,
  rows: ContextRow[] = CONTEXT_TABLE_ROWS,
): ContextRoutingResult {
  const forced = forcedRows(input, constraints)
  const scored = rows
    .map((row) => ({ row, score: rowScore(input, row) }))
    .sort((a, b) => b.score - a.score)

  const selectedByScore = scored
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.row.type)
  const selectedTypes = Array.from(new Set([...forced, ...selectedByScore])).slice(0, 4)
  const selectedRows = rows.filter((row) => selectedTypes.includes(row.type))
  const ignoredRows = rows
    .map((row) => row.type)
    .filter((rowType) => !selectedTypes.includes(rowType))

  return {
    selectedRows,
    ignoredRows,
    reasoning: `Selected context rows: ${selectedTypes.join(', ')}`,
  }
}

export function routeContextRows(
  input: string,
  rows: ContextRow[] = CONTEXT_TABLE_ROWS,
): ContextRoutingResult {
  return contextCheck(input, undefined, rows)
}

export function createPromptInjection(rows: ContextRow[]): string {
  if (!rows.length) return ''
  return rows
    .map(
      (row) =>
        `${row.label}: ${row.description}\nQuestions: ${row.keyQuestions.join(' | ')}`,
    )
    .join('\n\n')
}

export function buildSelfCorrectionRubric(rows: ContextRow[]): string[] {
  return rows.map(
    (row) => `${row.label}: ${row.keyQuestions[0] ?? 'Ensure response alignment.'}`,
  )
}

export function tagMemoryByContext(content: string): ContextMemoryTag {
  const rows = routeContextRows(content).selectedRows
  return {
    content,
    tags: rows.map((row) => row.type),
  }
}

export function splitContextsForAgents(): ContextAgentSplit {
  return {
    researcher: ['historical', 'environmental'],
    architect: ['technical', 'situational'],
    operator: ['relational', 'ethical'],
  }
}

export function buildContextPrimer(rows: ContextRow[]): string {
  return createPromptInjection(rows)
}

export function reviewWithContextTable(draftSummary: string, rows: ContextRow[]) {
  const warnings: string[] = []
  const normalized = draftSummary.toLowerCase()

  if (
    rows.some((row) => row.type === 'relational') &&
    !normalized.includes('stakeholder') &&
    !normalized.includes('owner')
  ) {
    warnings.push('Relational lens: include owner/stakeholder alignment.')
  }
  if (
    rows.some((row) => row.type === 'ethical') &&
    !normalized.includes('risk') &&
    !normalized.includes('guardrail')
  ) {
    warnings.push('Ethical lens: include risk/guardrail checks.')
  }

  return {
    warnings,
    rewrittenSummary: warnings.length
      ? `${draftSummary} (context-reviewed with additional safeguards)`
      : undefined,
  }
}

export function getMultiAgentLensMap() {
  return splitContextsForAgents()
}

export function getContextTableRows() {
  return CONTEXT_TABLE_ROWS
}
