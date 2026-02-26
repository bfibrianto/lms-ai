import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const BACKOFFICE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR', 'LEADER']

function getDashboardPath(role: string): string {
  return BACKOFFICE_ROLES.includes(role)
    ? '/backoffice/dashboard'
    : '/portal/dashboard'
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  })
  const isLoggedIn = !!token
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/auth')
  const isApiAuth = pathname.startsWith('/api/auth')

  if (isApiAuth) return NextResponse.next()

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(
      new URL(getDashboardPath(token.role as string), request.url)
    )
  }

  const isPublicPage = pathname === '/'

  if (!isAuthPage && !isPublicPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isLoggedIn && token.role) {
    const role = token.role as string
    const isBackoffice = BACKOFFICE_ROLES.includes(role)

    // Old dashboard redirect
    if (pathname === '/dashboard') {
      return NextResponse.redirect(
        new URL(getDashboardPath(role), request.url)
      )
    }

    // Prevent employee accessing backoffice
    if (!isBackoffice && pathname.startsWith('/backoffice')) {
      return NextResponse.redirect(new URL('/portal/dashboard', request.url))
    }

    // Prevent backoffice roles accessing portal
    if (isBackoffice && pathname.startsWith('/portal')) {
      return NextResponse.redirect(
        new URL('/backoffice/dashboard', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
