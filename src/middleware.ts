import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Allowed main domains
  const mainDomains = ['localhost:3000', 'aiclexrealestatecrm.vercel.app']
  const isMainDomain = mainDomains.includes(hostname)

  if (isMainDomain) {
    return NextResponse.next()
  }

  // Handle Subdomain (e.g., agency1.localhost:3000)
  let subdomain = ''
  if (hostname.includes('localhost:3000')) {
    const parts = hostname.split('.localhost:3000')
    if (parts.length > 1) subdomain = parts[0]
  } else if (hostname.includes('aiclexrealestatecrm.vercel.app')) {
    const parts = hostname.split('.aiclexrealestatecrm.vercel.app')
    if (parts.length > 1) subdomain = parts[0]
  }

  const requestHeaders = new Headers(request.headers)

  if (subdomain && subdomain !== 'www') {
    requestHeaders.set('x-agency-subdomain', subdomain)
  } else {
    // Treat as Custom Domain if it's not a main domain and not a subdomain
    requestHeaders.set('x-agency-custom-domain', hostname)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - portal-inactive (error page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|portal-inactive).*)',
  ],
}
