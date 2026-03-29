import { NextResponse } from 'next/server'

/**
 * Ops check: curl http://HOST:3000/api/health
 * If this fails, the Node process / firewall / proxy is wrong — not React.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'martin-os',
      time: new Date().toISOString(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
