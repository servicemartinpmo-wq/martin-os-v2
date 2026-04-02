export const runtime = 'nodejs'

const store = []
const MAX_EVENTS = 300
const replayCache = new Map()
const MAX_REPLAY_CACHE = 500

function trim() {
  while (store.length > MAX_EVENTS) store.shift()
}

function trimReplayCache() {
  while (replayCache.size > MAX_REPLAY_CACHE) {
    const firstKey = replayCache.keys().next().value
    replayCache.delete(firstKey)
  }
}

function getIdempotencyKey(req, body) {
  const headerKey = req.headers.get('x-idempotency-key')
  if (headerKey && headerKey.trim()) return headerKey.trim()
  if (typeof body?.idempotencyKey === 'string' && body.idempotencyKey.trim()) {
    return body.idempotencyKey.trim()
  }
  return null
}

function readLimit(req, fallback = 100) {
  const raw = new URL(req.url).searchParams.get('limit')
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.min(300, Math.floor(parsed)))
}

export async function GET(req) {
  const limit = readLimit(req, 100)
  return Response.json({ events: [...store].reverse().slice(0, limit), persisted: 'memory_demo' })
}

/** Interim DB-adapter contract; currently process-memory fallback. */
export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const idempotencyKey = getIdempotencyKey(req, body)
  const requestFingerprint = JSON.stringify({
    type: typeof body.type === 'string' ? body.type : 'event',
    summary: typeof body.summary === 'string' ? body.summary : '',
    id: body.id ?? null,
  })

  if (idempotencyKey && replayCache.has(idempotencyKey)) {
    const cached = replayCache.get(idempotencyKey)
    if (cached.requestFingerprint !== requestFingerprint) {
      return Response.json(
        { error: 'Idempotency key reuse with different payload' },
        { status: 409 },
      )
    }
    return Response.json(
      { ...cached.payload, idempotentReplay: true },
      { status: cached.status, headers: { 'x-idempotent-replay': '1' } },
    )
  }

  const event = {
    id: body.id ?? `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    type: typeof body.type === 'string' ? body.type : 'event',
    summary: typeof body.summary === 'string' ? body.summary : '',
  }
  store.push(event)
  trim()

  const payload = { ok: true, event, persisted: 'memory_demo' }
  if (idempotencyKey) {
    replayCache.set(idempotencyKey, {
      requestFingerprint,
      status: 200,
      payload,
    })
    trimReplayCache()
  }

  return Response.json(payload)
}
