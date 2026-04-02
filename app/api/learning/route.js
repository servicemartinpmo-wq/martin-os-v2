export const runtime = 'nodejs'

/** In-process demo store (replace with DB / KV for production). */
const store = []
const replayCache = new Map()
const MAX_REPLAY_CACHE = 500

function trim() {
  while (store.length > 500) store.shift()
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
  return Math.max(1, Math.min(500, Math.floor(parsed)))
}

export async function GET(req) {
  const limit = readLimit(req, 100)
  return Response.json({
    events: [...store].reverse().slice(0, limit),
    demo: true,
    source: 'in_process_memory',
  })
}

export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const idempotencyKey = getIdempotencyKey(req, body)
  const requestFingerprint = JSON.stringify({
    decision: typeof body.decision === 'string' ? body.decision : '',
    outcome: typeof body.outcome === 'string' ? body.outcome : '',
    owner: typeof body.owner === 'string' ? body.owner : '',
    expected: typeof body.expected === 'string' ? body.expected : '',
    correlationId: body.correlationId ?? null,
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
  const payload = {
    ok: true,
    event,
    persisted: 'in_process_memory',
    source: 'in_process_memory',
  }

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
