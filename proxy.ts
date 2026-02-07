import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/rooms'];
const AUTH_ROUTES = ['/auth'];

const i18nMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
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
    return i18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|sitemap.xml|robots.txt).*)']
}