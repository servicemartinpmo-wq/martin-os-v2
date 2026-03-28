import type { ContextIntelligence, ContextMemoryTag, ContextRow, ContextRowType, K2WConstraints } from '../agents/types'
import {
  buildSelfCorrectionRubric,
  contextCheck,
  createPromptInjection,
  getContextTableRows,
  splitContextsForAgents,
  tagMemoryByContext,
} from './context-table'

export function buildContextIntelligence(
  input: string,
  constraints?: K2WConstraints,
): ContextIntelligence {
  const routing = contextCheck(input, constraints)
  const promptInjection = createPromptInjection(routing.selectedRows)
  const validationRubric = buildSelfCorrectionRubric(routing.selectedRows)
  const memoryTag = tagMemoryByContext(input)
  const agentSplit = splitContextsForAgents()

  return {
    routing,
    promptInjection,
    validationRubric,
    memoryTag,
    agentSplit,
  }
}

export function getContextRowsForIntent(
  input: string,
  constraints?: K2WConstraints,
): ContextRow[] {
  return contextCheck(input, constraints).selectedRows
}

export function buildPromptInjectionFromInput(
  input: string,
  constraints?: K2WConstraints,
): string {
  return buildContextIntelligence(input, constraints).promptInjection
}

export function buildSelfCorrectionChecklist(
  input: string,
  constraints?: K2WConstraints,
): string[] {
  return buildContextIntelligence(input, constraints).validationRubric
}

export function mapMultiAgentContexts() {
  return splitContextsForAgents()
}

export function evaluateDraftAgainstContext(
  input: string,
  draft: { workflow_name?: string },
) {
  const routing = contextCheck(input)
  const warnings: string[] = []
  const summary = (draft.workflow_name ?? '').toLowerCase()

  if (
    routing.selectedRows.some((row) => row.type === 'relational') &&
    !summary.includes('stakeholder') &&
    !summary.includes('owner')
  ) {
    warnings.push('Relational context check: include owner/stakeholder alignment.')
  }

  if (
    routing.selectedRows.some((row) => row.type === 'ethical') &&
    !summary.includes('risk')
  ) {
    warnings.push('Ethical context check: include risk framing or safeguards.')
  }

  return {
    routedRows: routing.selectedRows,
    routerReasoning: routing.reasoning,
    warnings,
  }
}

export function tagInputMemory(
  content: string,
): ContextMemoryTag {
  return tagMemoryByContext(content)
}

export function toContextRowTypes(rows: ContextRow[]): ContextRowType[] {
  return rows.map((row) => row.type)
}
