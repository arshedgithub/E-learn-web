import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { resetPasswordDtoSchema, ResetPasswordDto } from '@/types';
import { validate, errorResponse, successResponse, withDB } from '@/lib';

export const runtime = 'nodejs';

const authService = new AuthService();

export const POST = withDB(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { token, newPassword } = validate<ResetPasswordDto>(resetPasswordDtoSchema, body);
        await authService.resetPassword(token, newPassword);
        return successResponse({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password reset error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Password reset failed',
            400
        );
    }
}); 