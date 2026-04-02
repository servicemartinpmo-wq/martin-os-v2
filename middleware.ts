import { NextResponse } from 'next/server'

/**
 * Enforce a single UI source of truth:
 * all non-API, non-static routes resolve to "/".
 */
export function middleware(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  const isApi = pathname.startsWith('/api')
  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (isApi || isStaticAsset || pathname === '/') {
    return NextResponse.next()
  }

  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
