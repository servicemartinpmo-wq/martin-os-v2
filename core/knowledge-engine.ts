import { FRAMEWORK_REGISTRY } from '../src/registry/frameworkRegistry'
import { buildWorkflowFromKnowledge as buildWorkflowFromKnowledgeAgents } from '../agents/k2w-workflow-assembler'
import type {
  K2WConstraints,
  K2WKnowledgeCollection,
  K2WExecutionResult,
  KnowledgeObject,
  KnowledgeType,
} from '../agents/types'

const METHOD_CATALOG: KnowledgeObject[] = [
  {
    id: 'method_define_segments',
    name: 'Define Customer Segments',
    type: 'methods',
    inputs: ['customer_data'],
    outputs: ['segments'],
    dependencies: [],
  },
  {
    id: 'method_generate_content',
    name: 'Generate Content',
    type: 'methods',
    inputs: ['segments', 'goal'],
    outputs: ['content_assets'],
    dependencies: ['method_define_segments'],
  },
]

const TRIGGER_CATALOG: KnowledgeObject[] = [
  {
    id: 'trigger_email_on_segment',
    name: 'Email Trigger',
    type: 'triggers',
    condition: { segment: 'VIP' },
    action: 'send_email',
    inputs: ['segments'],
    outputs: ['email_status'],
  },
]

const FORMULA_CATALOG: KnowledgeObject[] = [
  {
    id: 'formula_ltv',
    name: 'Compute LTV',
    type: 'formulas',
    formula: 'ARPU * lifespan',
    inputs: ['ARPU', 'lifespan'],
    outputs: ['LTV'],
  },
]

const SYSTEM_CATALOG: KnowledgeObject[] = [
  {
    id: 'system_execution_runtime',
    name: 'Execution Runtime',
    type: 'systems',
    inputs: ['workflow'],
    outputs: ['execution_result'],
  },
]

function toFrameworkObject(
  id: string,
  row: Record<string, unknown>,
): KnowledgeObject {
  return {
    id,
    name: String(row.name ?? id),
    type: 'frameworks',
    description: typeof row.description === 'string' ? row.description : undefined,
    domain: typeof row.domain === 'string' ? row.domain : undefined,
    requiredInputs: ['context'],
    outputs: ['framework_steps'],
  }
}

function pickByIds(rows: KnowledgeObject[], ids?: string[]): KnowledgeObject[] {
  if (!ids?.length) return rows
  const set = new Set(ids)
  return rows.filter((row) => set.has(row.id))
}

function getCatalogByType(type: KnowledgeType): KnowledgeObject[] {
  switch (type) {
    case 'frameworks':
      return Object.entries(FRAMEWORK_REGISTRY).map(([id, row]) =>
        toFrameworkObject(id, row as Record<string, unknown>),
      )
    case 'methods':
      return METHOD_CATALOG
    case 'triggers':
      return TRIGGER_CATALOG
    case 'formulas':
      return FORMULA_CATALOG
    case 'systems':
      return SYSTEM_CATALOG
    default:
      return []
  }
}

export async function getKnowledgeByType(
  types: KnowledgeType[],
  selectedIds: Partial<Record<KnowledgeType, string[]>> = {},
): Promise<K2WKnowledgeCollection> {
  const uniqueTypes = Array.from(new Set(types))

  const frameworks = uniqueTypes.includes('frameworks')
    ? pickByIds(getCatalogByType('frameworks'), selectedIds.frameworks)
    : []
  const methods = uniqueTypes.includes('methods')
    ? pickByIds(getCatalogByType('methods'), selectedIds.methods)
    : []
  const triggers = uniqueTypes.includes('triggers')
    ? pickByIds(getCatalogByType('triggers'), selectedIds.triggers)
    : []
  const formulas = uniqueTypes.includes('formulas')
    ? pickByIds(getCatalogByType('formulas'), selectedIds.formulas)
    : []
  const systems = uniqueTypes.includes('systems')
    ? pickByIds(getCatalogByType('systems'), selectedIds.systems)
    : []

  return { frameworks, methods, triggers, formulas, systems }
}

export function buildWorkflowFromKnowledge(
  knowledge: K2WKnowledgeCollection,
  constraints: K2WConstraints = {},
): ReturnType<typeof buildWorkflowFromKnowledgeAgents> {
  return buildWorkflowFromKnowledgeAgents(knowledge, constraints)
}

export async function runWorkflow(
  workflow: ReturnType<typeof buildWorkflowFromKnowledgeAgents>,
): Promise<K2WExecutionResult> {
  const executed = workflow.steps.map((step) => ({
    step_id: step.step_id,
    status: 'completed' as const,
    message: `Executed ${step.type}: ${step.name}`,
  }))

  return {
    workflow_name: workflow.workflow_name,
    status: 'completed',
    steps_executed: executed,
    completed_at: new Date().toISOString(),
  }
}
