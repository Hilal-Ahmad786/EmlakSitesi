import { auth } from '@/lib/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    const isPrivatePage = req.nextUrl.pathname.includes('/admin') &&
        !req.nextUrl.pathname.includes('/login');

    if (isPrivatePage && !req.auth) {
        // Simple redirection to login if unauthenticated on admin pages
        // We guess locale or default to 'en' if not present
        return NextResponse.redirect(new URL('/en/admin/login', req.url));
    }

    return intlMiddleware(req);
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
