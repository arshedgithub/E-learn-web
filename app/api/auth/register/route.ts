import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { registerDtoSchema, RegisterDto } from '@/types';
import { validate, errorResponse, successResponse } from '@/lib';

const authService = new AuthService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username, firstName, lastName } = validate<RegisterDto>(registerDtoSchema, body);
        const result = await authService.register(email, password, username, firstName, lastName);
        
        return successResponse(result.user);
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error && error.message.includes('already exists')) {
            return errorResponse(error.message, 409);
        }
        return errorResponse('Registration failed', 500);
    }
} 