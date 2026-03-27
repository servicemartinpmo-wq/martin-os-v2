export const runtime = 'nodejs'

/** Stub Tech-Ops logs — replace with SSE / drain. */
export async function GET() {
  const lines = [
    `[${new Date().toISOString()}] dispatcher: health ok`,
    `[${new Date().toISOString()}] tier-router: cache warm`,
    `[${new Date().toISOString()}] kb-sync: idle`,
  ]
  return Response.json({ lines })
}
