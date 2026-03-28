export type AgentName = 'strategist' | 'marketing' | 'ops' | 'tech' | 'analyst'

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
