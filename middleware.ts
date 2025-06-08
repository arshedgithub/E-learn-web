import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { USER_ROLE } from '@/types';

// Paths that require authentication
const AUTH_PATHS = [
    '/dashboard',
    '/profile',
    '/settings',
    '/api/users',
    '/api/courses',
    '/api/enrollments'
];

// Paths that require admin role
const ADMIN_PATHS = [
    '/admin',
    '/api/admin'
];

// Public paths that don't require authentication
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth'
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for token
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return redirectToLogin(req);
    }

    try {
        // Verify token
        const payload = verifyToken(token);
        if (!payload) {
            return redirectToLogin(req);
        }

        // Check admin access
        if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
            if (payload.role !== USER_ROLE.ADMIN) {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
        }

        // Add user info to headers for API routes
        if (pathname.startsWith('/api/')) {
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-id', payload.userId);
            requestHeaders.set('x-user-role', payload.role);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        }

        return NextResponse.next();
    } catch (error) {
        // Clear invalid token
        const response = redirectToLogin(req);
        response.cookies.delete('token');
        return response;
    }
}

function redirectToLogin(req: NextRequest) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/auth/* (authentication routes)
         * 2. /_next/* (Next.js internals)
         * 3. /fonts/* (inside public directory)
         * 4. /favicon.ico, /sitemap.xml (static files)
         * 5. /*.png, /*.jpg, /*.jpeg, /*.gif, /*.svg (static files)
         */
        '/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml|[\\w-]+\\.(?:png|jpg|jpeg|gif|svg)$).*)',
    ],
};
