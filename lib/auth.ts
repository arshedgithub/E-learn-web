import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { USER_ROLE } from '@/types';
import { JWT_SECRET } from '@/config';

export const runtime = 'nodejs';

export class AuthError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: USER_ROLE;
    iat?: number;
    exp?: number;
}

export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    if (!JWT_SECRET) {
        throw new AuthError('JWT secret not configured', 'CONFIG_ERROR');
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload {
    if (!JWT_SECRET) {
        throw new AuthError('JWT secret not configured', 'CONFIG_ERROR');
    }

    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthError('Token expired', 'TOKEN_EXPIRED');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthError('Invalid token', 'INVALID_TOKEN');
        }
        throw new AuthError('Token verification failed', 'VERIFICATION_FAILED');
    }
}

export async function getAuthUser(requiredRole?: USER_ROLE): Promise<TokenPayload> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            throw new AuthError('No token provided', 'NO_TOKEN');
        }

        const payload = verifyToken(token);
        
        if (requiredRole && payload.role !== requiredRole) {
            throw new AuthError('Insufficient permissions', 'FORBIDDEN');
        }

        return payload;
    } catch (error) {
        if (error instanceof AuthError) {
            throw error;
        }
        throw new AuthError('Authentication failed', 'AUTH_FAILED');
    }
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
    });
    return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
    response.cookies.delete('token');
    return response;
}

// Middleware function for protecting routes
export async function withAuth(handler: Function) {
    return async (request: Request) => {
        try {
            const token = request.headers.get('authorization')?.split(' ')[1];
            if (!token) {
                return NextResponse.json(
                    { error: 'No token provided' },
                    { status: 401 }
                );
            }

            const payload = verifyToken(token);
            // Add user to request headers for the handler to use
            const requestWithUser = new Request(request.url, {
                ...request,
                headers: new Headers({
                    ...Object.fromEntries(request.headers),
                    'x-user-id': payload.userId,
                    'x-user-email': payload.email,
                    'x-user-role': payload.role
                })
            });

            return handler(requestWithUser);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
    };
}