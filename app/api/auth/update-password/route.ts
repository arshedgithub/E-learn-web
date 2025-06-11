import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { updatePasswordDtoSchema, UpdatePasswordDto } from '@/types';
import { validate, errorResponse, successResponse, withDB } from '@/lib';

export const runtime = 'nodejs';

const authService = new AuthService();

export const POST = withDB(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { currentPassword, newPassword } = validate<UpdatePasswordDto>(updatePasswordDtoSchema, body);
        await authService.updatePassword(req, currentPassword, newPassword);
        return successResponse({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Password update failed',
            400
        );
    }
}); 