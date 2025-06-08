import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { USER_ROLE } from '@/types';
import { NextResponse } from 'next/server';

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
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new AuthError('JWT secret not configured', 'CONFIG_ERROR');
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload {
    const JWT_SECRET = process.env.JWT_SECRET;
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