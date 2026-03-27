export const runtime = 'nodejs'

/** Stub — replace with Postgres/KV. Client memoryStore is demo-only. */
export async function POST(req) {
  try {
    const body = await req.json()
    return Response.json({ ok: true, stub: true, received: Boolean(body) })
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
}
