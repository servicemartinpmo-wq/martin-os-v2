export const runtime = 'nodejs'

const store = []
const MAX_EVENTS = 300

function trim() {
  while (store.length > MAX_EVENTS) store.shift()
}

export async function GET() {
  return Response.json({ events: [...store].reverse().slice(0, 100), persisted: 'memory_demo' })
}

/** Interim DB-adapter contract; currently process-memory fallback. */
export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = {
    id: body.id ?? `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    type: typeof body.type === 'string' ? body.type : 'event',
    summary: typeof body.summary === 'string' ? body.summary : '',
  }
  store.push(event)
  trim()

  return Response.json({ ok: true, event, persisted: 'memory_demo' })
}
