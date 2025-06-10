import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { withDB } from '@/lib/db-init';

export const POST = withDB(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, password, username, firstName, lastName } = body;

        // Validate required fields
        if (!email || !password || !username || !firstName || !lastName) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const authService = new AuthService();
        const result = await authService.register(
            email,
            password,
            username,
            firstName,
            lastName
        );

        return new Response(
            JSON.stringify(result),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle specific error cases
        if (error.message === 'User already exists') {
            return new Response(
                JSON.stringify({ message: 'Email already registered' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Registration failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}); 