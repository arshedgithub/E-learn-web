import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { resetPasswordDtoSchema, ResetPasswordDto } from '@/types';
import { validate, errorResponse, successResponse } from '@/lib';

const authService = new AuthService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = validate<ResetPasswordDto>(resetPasswordDtoSchema, body);
        await authService.forgotPassword(email);
        
        return successResponse({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Password reset request error:', error);
        return errorResponse('Failed to process password reset request', 500);
    }
} 