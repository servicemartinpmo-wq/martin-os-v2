import { generateText } from 'ai'

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
  const context = typeof body.context === 'string' ? body.context : ''

  const fallback = () =>
    Response.json({
      mock: true,
      mode,
      summary: 'Offline brain stub — configure VERCEL_OIDC_TOKEN or AI_GATEWAY_API_KEY for live models.',
      priorities: [
        { title: 'Review initiative roadmap', confidence: 0.72 },
        { title: 'Unblock Tech-Ops escalation queue', confidence: 0.61 },
      ],
      risks: [{ label: 'Schedule compression on Project Phoenix', severity: 'warning' }],
    })

  try {
    const { text } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system:
        mode === 'brain'
          ? 'You are Martin OS chief-of-staff. Reply with concise JSON only: {"summary":string,"priorities":[{"title":string,"confidence":number}],"risks":[{"label":string,"severity":"warning"|"error"}]}. No markdown.'
          : 'You are a helpful assistant for Martin OS.',
      prompt:
        mode === 'brain'
          ? `Context: ${context.slice(0, 6000)}\nProduce the JSON object only.`
          : context || 'Hello',
    })

    if (mode === 'brain') {
      try {
        const parsed = JSON.parse(text)
        return Response.json({ mock: false, ...parsed })
      } catch {
        return Response.json({
          mock: false,
          raw: text,
          parseError: true,
        })
      }
    }

    return Response.json({ mock: false, text })
  } catch {
    return fallback()
  }
}
