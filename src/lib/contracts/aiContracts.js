import { z } from 'zod'

export const AiOrchestrateRequestSchema = z.object({
  appView: z.enum(['PMO', 'TECH_OPS', 'MIIDLE']),
  snapshot: z.string().max(8000).default(''),
  cognitiveProfileId: z.string().max(64).optional(),
  stream: z.boolean().optional().default(false),
})

export const AiPrioritySchema = z.object({
  title: z.string(),
  confidence: z.number().min(0).max(1).optional(),
})

export const AiRiskSchema = z.object({
  label: z.string(),
  severity: z.enum(['warning', 'error']).optional(),
})

export const AiAgentResponseSchema = z.object({
  role: z.string(),
  mock: z.boolean().optional(),
  summary: z.string().optional(),
  priorities: z.array(AiPrioritySchema).optional(),
  risks: z.array(AiRiskSchema).optional(),
  text: z.string().optional(),
  raw: z.string().optional(),
  parseError: z.boolean().optional(),
})

export const AiOrchestrateResponseSchema = z.object({
  appView: z.enum(['PMO', 'TECH_OPS', 'MIIDLE']),
  mode: z.literal('orchestrate'),
  results: z.array(AiAgentResponseSchema),
  source: z.enum(['next-api']),
})
