import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { registerDtoSchema, RegisterDto } from '@/types';
import { validate, errorResponse, successResponse, withDB } from '@/lib';

export const runtime = 'nodejs';

const authService = new AuthService();

export const POST = withDB(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, password, username, firstName, lastName } = validate<RegisterDto>(registerDtoSchema, body);
        const user = await authService.register(email, password, username, firstName, lastName);
        return successResponse({ user });
    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Registration failed',
            400
        );
    }
}); 