import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_HOME = {
    admin: '/admin/dashboard',
    kitchen: '/kitchen/dashboard',
    driver: '/driver/dashboard',
} as const

const ROLE_PREFIX = {
    admin: '/admin',
    kitchen: '/kitchen',
    driver: '/driver',
} as const

type Role = keyof typeof ROLE_HOME

function getRoleFromCookie(request: NextRequest): Role | null {
    const role = request.cookies.get('user-role')?.value
    return role && role in ROLE_HOME ? (role as Role) : null
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('accesstoken')?.value
    const role = getRoleFromCookie(request)

    const protectedPrefixes = Object.values(ROLE_PREFIX)
    const isProtected = protectedPrefixes.some(p => pathname.startsWith(p))

    // ── Not logged in → send to login
    if (!token && isProtected) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ── Logged in, hits /login → send to their dashboard
    if (token && pathname === '/login') {
        const home = role ? ROLE_HOME[role] : '/admin/dashboard'
        return NextResponse.redirect(new URL(home, request.url))
    }

    // ── Logged in, wrong section → redirect to own dashboard
    if (token && role && isProtected) {
        const allowedPrefix = ROLE_PREFIX[role]
        if (!pathname.startsWith(allowedPrefix)) {
            const home = new URL(ROLE_HOME[role], request.url)
            home.searchParams.set('unauthorized', '1')
            return NextResponse.redirect(home)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login',
        '/admin/:path*',
        '/kitchen/:path*',
        '/driver/:path*',
    ]
}