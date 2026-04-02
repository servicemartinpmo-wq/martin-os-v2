import { POST as orchestratePost } from '@/app/api/ai/orchestrate/route'

export const runtime = 'nodejs'

/**
 * Martin OS brain — AI Gateway via model string (OIDC on Vercel).
 * No client-side API keys.
 */
export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const mode = body.mode ?? 'brain'
  if (mode === 'orchestrate') {
    return orchestratePost(
      new Request(req.url, {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(body),
      }),
    )
  }
  const context = typeof body.context === 'string' ? body.context : ''
  return Response.json({
    mock: true,
    mode,
    summary: 'AI route compatibility mode. Use /api/ai/orchestrate for typed orchestration.',
    priorities: [{ title: `Processed context (${Math.min(context.length, 6000)} chars)`, confidence: 0.5 }],
    risks: [],
  })
}
