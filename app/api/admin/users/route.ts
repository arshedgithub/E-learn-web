import { NextRequest } from 'next/server';
import { USER_ROLE } from '@/types';
import { UserService } from '@/services';
import { getAuthUser, errorResponse, successResponse } from '@/lib';

const userService = new UserService();

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(USER_ROLE.ADMIN);
        
        const users = await userService.getAllUsers(user.userId);
        return successResponse(users);
    } catch (error) {
        console.error('Get users error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Failed to get users',
            error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500
        );
    }
} 