// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('sb-access-token')?.value
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
