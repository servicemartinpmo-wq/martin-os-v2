import type { AgentName, ParsedIntent } from '../agents/types'

const MARKETING_TERMS = ['marketing', 'campaign', 'growth', 'funnel', 'conversion', 'content']
const STRATEGY_TERMS = ['strategy', 'strategic', 'positioning', 'vision', 'market']
const TECH_TERMS = ['automation', 'automate', 'api', 'integration', 'workflow', 'system']
const DATA_TERMS = ['data', 'analytics', 'kpi', 'metric', 'performance', 'insight']
const K2W_TERMS = ['knowledge', 'framework', 'method', 'trigger', 'formula']

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term))
}

function classifyType(normalized: string): AgentName {
  if (hasAny(normalized, K2W_TERMS)) return 'k2w'
  if (hasAny(normalized, STRATEGY_TERMS)) return 'strategist'
  if (hasAny(normalized, MARKETING_TERMS)) return 'marketing'
  if (hasAny(normalized, TECH_TERMS)) return 'tech'
  if (hasAny(normalized, DATA_TERMS)) return 'analyst'
  return 'ops'
}

function inferGoal(normalized: string): string {
  if (normalized.includes('launch')) return 'launch a new initiative'
  if (normalized.includes('grow') || normalized.includes('growth')) return 'accelerate growth'
  if (normalized.includes('automate')) return 'automate operations'
  if (normalized.includes('optimize') || normalized.includes('improve')) return 'optimize performance'
  return 'improve execution quality'
}

export function parseIntent(input: string): ParsedIntent {
  const normalized = input.toLowerCase().trim()
  const type = classifyType(normalized)
  const goal = inferGoal(normalized)

  return {
    type,
    goal,
    domain: type,
    originalInput: input,
  }
}
