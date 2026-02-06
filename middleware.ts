import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/rooms'];
const AUTH_ROUTES = ['/auth', '/login', '/register'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value;
    const { pathname } = request.nextUrl;
    if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }
    if (token && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}