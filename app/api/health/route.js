import { NextResponse } from 'next/server'

/**
 * Ops check: curl http://HOST:3000/api/health
 * If this fails, the Node process / firewall / proxy is wrong — not React.
 */
export async function GET() {
  const mem = typeof process?.memoryUsage === 'function' ? process.memoryUsage() : null
  const uptimeSeconds = typeof process?.uptime === 'function' ? process.uptime() : null
  return NextResponse.json(
    {
      ok: true,
      service: 'martin-os',
      time: new Date().toISOString(),
      uptimeSeconds,
      memory: mem
        ? {
            rss: mem.rss,
            heapTotal: mem.heapTotal,
            heapUsed: mem.heapUsed,
            external: mem.external,
            arrayBuffers: mem.arrayBuffers,
          }
        : null,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
