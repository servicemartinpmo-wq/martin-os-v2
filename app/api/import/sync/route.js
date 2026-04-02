import { z } from 'zod'

export const runtime = 'nodejs'

const ImportSyncRequestSchema = z.object({
  connectorId: z.string().min(1).max(120),
  workspaceId: z.string().max(120).optional(),
  dryRun: z.boolean().optional().default(false),
  runId: z.string().max(128).optional(),
})

/**
 * v1 import connector stub — replace with OAuth / signed requests per vendor.
 * POST { connectorId, workspaceId?, dryRun?: boolean }
 */
export async function POST(req) {
  let raw = {}
  try {
    raw = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ImportSyncRequestSchema.safeParse(raw)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data
  const connectorId = body.connectorId

  return Response.json({
    ok: true,
    demo: true,
    connectorId,
    workspaceId: body.workspaceId ?? null,
    runId: body.runId ?? null,
    dryRun: Boolean(body.dryRun),
    imported: { projects: 0, tasks: 0, labels: [] },
    message:
      'Stub sync — wire Asana/Jira/Trello OAuth and map entities to Martin ontology in Phase H backend.',
  })
}
