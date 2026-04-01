import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function tierGatingMiddleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const entitlements = session?.user?.app_metadata?.entitlements || []
  const pathname = req.nextUrl.pathname

  const moduleGates = [
    { path: '/pmo-ops', claim: 'pmo_ops' },
    { path: '/tech-ops', claim: 'tech_ops' },
    { path: '/miidle', claim: 'miidle' }
  ]

  for (const gate of moduleGates) {
    if (pathname.startsWith(gate.path)) {
      if (!entitlements.includes(gate.claim)) {
        return NextResponse.redirect(new URL('/settings?blocked=' + gate.claim, req.url))
      }
    }
  }
  return res
}
