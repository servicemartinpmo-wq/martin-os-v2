import { generateText } from 'ai'

export const runtime = 'nodejs'

/**
 * Expensive merge pass — gated by NEXT_PUBLIC_MERGE_AGENT=1 from client.
 */
export async function POST(req) {
  if (process.env.NEXT_PUBLIC_MERGE_AGENT !== '1') {
    return Response.json({ disabled: true, note: 'Set NEXT_PUBLIC_MERGE_AGENT=1 to enable.' }, { status: 403 })
  }

  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payloads = Array.isArray(body.payloads) ? body.payloads : []
  if (!payloads.length) {
    return Response.json({ merged: null, note: 'No payloads' })
  }

  const stub = () =>
    Response.json({
      mock: true,
      merged: {
        summary: 'Merged offline — enable AI Gateway for unified plan output.',
        priorities: [{ title: 'Consolidate agent outputs manually', confidence: 0.5 }],
      },
    })

  const serialized = payloads.map((p) => JSON.stringify(p).slice(0, 4000)).join('\n---\n')

  try {
    const { text } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system:
        'Merge multiple agent JSON outputs into one JSON object only: {"summary":string,"priorities":[{"title":string,"confidence":number}]}. No markdown.',
      prompt: `Combine these agent results:\n${serialized}`,
    })
    try {
      return Response.json({ mock: false, merged: JSON.parse(text) })
    } catch {
      return Response.json({ mock: false, raw: text })
    }
  } catch {
    return stub()
  }
}
