import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
    const isPrivatePage = req.nextUrl.pathname.includes('/admin') &&
        !req.nextUrl.pathname.includes('/login');

    if (isPrivatePage) {
        // Use JWT token check instead of auth() — works on Edge Runtime without DB
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            salt: process.env.NODE_ENV === 'production'
                ? '__Secure-authjs.session-token'
                : 'authjs.session-token',
        });

        if (!token) {
            return NextResponse.redirect(new URL('/en/admin/login', req.url));
        }
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
