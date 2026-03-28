export type AgentName = 'strategist' | 'marketing' | 'ops' | 'tech' | 'analyst' | 'k2w'

export type KnowledgeType = 'frameworks' | 'methods' | 'triggers' | 'formulas' | 'systems'

export type KnowledgeSource = 'supabase' | 'static'

export interface ParsedIntent {
  type: AgentName
  goal: string
  domain: string
  originalInput: string
}

export interface KnowledgePacket {
  domain: string
  insights: string[]
  source: KnowledgeSource
}

export interface AgentRequest {
  rawInput: string
  intent: ParsedIntent
  knowledge: KnowledgePacket
}

export interface AgentExecutionResult {
  agent: AgentName
  summary: string
  actions: string[]
  workflows: string[]
  risks?: string[]
  opportunities?: string[]
  insights?: string[]
}

export interface AgentDefinition {
  name: AgentName
  prompt: string
  run: (request: AgentRequest) => AgentExecutionResult
}

export interface WorkflowStep {
  step: string
  description?: string
}

export interface BrainResponse {
  summary: string
  actions: string[]
  workflows: string[]
}

export interface BrainExecutionResult {
  intent: ParsedIntent
  selectedAgent: AgentName
  knowledge: KnowledgePacket
  agentOutput: AgentExecutionResult
  response: BrainResponse
}

export interface K2WConstraints {
  domain?: string
  goals?: string[]
  priority?: 'low' | 'medium' | 'high'
  complexity?: 'low' | 'medium' | 'high'
  optimize_for?: string
}

export interface KnowledgeObject {
  id: string
  name: string
  type: KnowledgeType
  description?: string
  domain?: string
  requiredInputs?: string[]
  inputs?: string[]
  outputs?: string[]
  condition?: Record<string, unknown>
  action?: string
  expression?: string
  formula?: string
  dependencies?: string[]
}

export interface K2WKnowledgeCollection {
  frameworks: KnowledgeObject[]
  methods: KnowledgeObject[]
  triggers: KnowledgeObject[]
  formulas: KnowledgeObject[]
  systems: KnowledgeObject[]
}

export type K2WKnowledgeBundle = K2WKnowledgeCollection
export type K2WKnowledgeType = KnowledgeType
export type KnowledgeCollection = K2WKnowledgeCollection
export type KnowledgeObjectType = KnowledgeType
export type K2WKnowledgeObject = KnowledgeObject
export type K2WKnowledgeInput = KnowledgeObject
export type K2WGeneratedWorkflow = K2WWorkflow

export interface K2WWorkflowStep {
  step_id: string
  name: string
  type: 'framework_step' | 'method' | 'formula' | 'trigger' | 'execution'
  reference_id?: string
  trigger_id?: string
  formula_id?: string
  condition?: Record<string, unknown>
  action?: string
  formula?: string
  inputs: Record<string, string | number | boolean>
  outputs: Record<string, string>
  depends_on?: string[]
}

export interface K2WDagNode {
  id: string
  label: string
  type: K2WWorkflowStep['type']
}

export interface K2WDagEdge {
  from: string
  to: string
}

export interface K2WWorkflow {
  workflow_name: string
  steps: K2WWorkflowStep[]
  dag: {
    nodes: K2WDagNode[]
    edges: K2WDagEdge[]
  }
  cursor_plan: string[]
  meta: {
    priority: NonNullable<K2WConstraints['priority']>
    complexity: NonNullable<K2WConstraints['complexity']>
    optimize_for: string
    domain?: string
    goals: string[]
    validation: {
      compatible: boolean
      warnings: string[]
    }
  }
}

export interface K2WFrameworkAnalysis {
  orderedSteps: K2WWorkflowStep[]
  requiredInputs: string[]
  diagnostics: string[]
}

export interface K2WMethodSequence {
  sequencedMethods: K2WStepTemplate[]
  diagnostics: string[]
}

export interface K2WTriggerPlan {
  triggerSteps: K2WWorkflowStep[]
  diagnostics: string[]
}

export interface K2WFormulaPlan {
  formulaSteps: K2WWorkflowStep[]
  diagnostics: string[]
}

export interface K2WStepTemplate {
  id: string
  name: string
  type: 'method'
  order: number
  inputs: string[]
  outputs: string[]
  references?: {
    methodId?: string
  }
  dependsOn?: string[]
}

export interface K2WExecutionResult {
  workflow_name: string
  status: 'completed' | 'failed'
  steps_executed: {
    step_id: string
    status: 'completed' | 'failed'
    message: string
  }[]
  completed_at: string
}

export type ContextRowType =
  | 'technical'
  | 'situational'
  | 'ethical'
  | 'historical'
  | 'relational'
  | 'environmental'

export interface ContextRow {
  id: string
  type: ContextRowType
  label: string
  description: string
  keyQuestions: string[]
  keywords: string[]
  priority: 'low' | 'medium' | 'high'
}

export interface ContextRoutingResult {
  selectedRows: ContextRow[]
  ignoredRows: ContextRowType[]
  reasoning: string
}

export interface ContextMemoryTag {
  content: string
  tags: ContextRowType[]
}

export interface ContextAgentSplit {
  researcher: ContextRowType[]
  architect: ContextRowType[]
  operator: ContextRowType[]
}

export interface ContextIntelligence {
  routing: ContextRoutingResult
  promptInjection: string
  validationRubric: string[]
  memoryTag: ContextMemoryTag
  agentSplit: ContextAgentSplit
}

export interface K2WContextEvaluation {
  routedRows: ContextRow[]
  promptInjection: string
  selfCorrectionRubric: string[]
  warnings: string[]
  rewrittenSummary?: string
}
