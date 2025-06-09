import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { updatePasswordDtoSchema, UpdatePasswordDto } from '@/types';
import { validate, errorResponse, successResponse } from '@/lib';

const authService = new AuthService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = validate<UpdatePasswordDto>(updatePasswordDtoSchema, body);
        await authService.resetPassword(token, password);
        
        return successResponse({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        if (error instanceof Error && error.message.includes('Invalid or expired code')) {
            return errorResponse(error.message, 400);
        }
        return errorResponse('Failed to update password', 500);
    }
} 