import { z } from 'zod'

export const dashboardKpiSchema = z.object({
  label: z.string(),
  value: z.string(),
  hint: z.string(),
})

export const goalsResponseSchema = z.object({
  source: z.enum(['supabase', 'fallback']),
  diagnostics: z.object({
    initiativesError: z.string().nullable(),
    insightsError: z.string().nullable(),
  }),
  data: z.object({
    kpis: z.array(dashboardKpiSchema),
    orgHealth: z.number(),
    activeInitiatives: z.number(),
    atRisk: z.number(),
    avgCompletion: z.number().nullable(),
    initiativeRows: z.array(z.record(z.any())),
    insightRows: z.array(z.record(z.any())),
  }),
})

export const techOpsResponseSchema = z.object({
  source: z.enum(['supabase', 'fallback']),
  diagnosticsMeta: z.object({
    diagnosticsError: z.string().nullable(),
    workflowsError: z.string().nullable(),
  }),
  data: z.object({
    kpis: z.array(dashboardKpiSchema),
    diagnostics: z.array(z.record(z.any())),
    workflows: z.array(z.record(z.any())),
    connectorHealth: z.array(z.record(z.any())),
    slaBoard: z.array(z.record(z.any())),
  }),
})

export const miiddleResponseSchema = z.object({
  source: z.enum(['supabase', 'fallback']),
  diagnosticsMeta: z.object({
    activityError: z.string().nullable(),
    jobsError: z.string().nullable(),
    artifactsError: z.string().nullable(),
  }),
  data: z.object({
    kpis: z.array(dashboardKpiSchema),
    activities: z.array(z.record(z.any())),
    jobs: z.array(z.record(z.any())),
    artifacts: z.array(z.record(z.any())),
  }),
})
