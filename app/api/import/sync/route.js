export const runtime = 'nodejs'

/**
 * v1 import connector stub — replace with OAuth / signed requests per vendor.
 * POST { connectorId, workspaceId?, dryRun?: boolean }
 */
export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const connectorId = typeof body.connectorId === 'string' ? body.connectorId : 'unknown'

  return Response.json({
    ok: true,
    demo: true,
    connectorId,
    dryRun: Boolean(body.dryRun),
    imported: { projects: 0, tasks: 0, labels: [] },
    message:
      'Stub sync — wire Asana/Jira/Trello OAuth and map entities to Martin ontology in Phase H backend.',
  })
}
