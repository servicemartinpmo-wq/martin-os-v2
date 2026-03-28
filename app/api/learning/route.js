export const runtime = 'nodejs'

/** In-process demo store (replace with DB / KV for production). */
const store = []

function trim() {
  while (store.length > 500) store.shift()
}

export async function GET() {
  return Response.json({ events: [...store].reverse().slice(0, 100), demo: true })
}

export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = {
    id: `lrn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    decision: body.decision ?? '',
    outcome: body.outcome ?? '',
    owner: body.owner ?? '',
    expected: body.expected ?? '',
    correlationId: body.correlationId ?? null,
  }
  store.push(event)
  trim()
  return Response.json({ ok: true, event, persisted: 'memory_demo' })
}
