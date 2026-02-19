import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude the login page itself to avoid redirect loop
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const adminCookie = request.cookies.get('rf_admin');
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if cookie exists and matches the env password
        if (!adminCookie || adminCookie.value !== adminPassword) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
