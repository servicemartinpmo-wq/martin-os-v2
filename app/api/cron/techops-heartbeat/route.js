export const runtime = 'nodejs'

/**
 * Platform cron target — Tech-Ops monitoring should run here or Workflow, not `setInterval` in React.
 * Vercel Cron sends Authorization: Bearer CRON_SECRET when configured.
 */
export async function GET(req) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return Response.json({
    ok: true,
    at: new Date().toISOString(),
    note: 'Heartbeat stub — push metrics to LiveLogs API or observability drain.',
  })
}
