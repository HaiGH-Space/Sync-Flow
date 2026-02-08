import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/rooms'];
const AUTH_ROUTES = ['/auth'];

const i18nMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('session_token')?.value;

    const localeMatch = pathname.match(new RegExp(`^/(${routing.locales.join('|')})`));
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    
    let pathnameWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
    if (pathnameWithoutLocale === '') pathnameWithoutLocale = '/';
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathnameWithoutLocale.startsWith(route));

    if (!token && isProtectedRoute) {
        const loginUrl = new URL(`/${locale}/auth`, request.url);

        loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
        
        return NextResponse.redirect(loginUrl);
    }

    const isAuthRoute = AUTH_ROUTES.some(route => pathnameWithoutLocale.startsWith(route));

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    return i18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|sitemap.xml|robots.txt).*)']
}