import { NextRequest } from 'next/server';
import { UserService } from '@/services';
import { getAuthUser, errorResponse, successResponse, validate } from '@/lib';
import { updateUserDtoSchema, UpdateUserDto } from '@/types/dtos/user';

const userService = new UserService();

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        const profile = await userService.getUserProfile(user.userId);
        return successResponse(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Failed to get profile',
            401
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await getAuthUser();
        const body = await req.json();
        const validatedData = validate<UpdateUserDto>(updateUserDtoSchema, body);
        
        const updatedUser = await userService.updateUserProfile(user.userId, validatedData);
        return successResponse(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Failed to update profile',
            400
        );
    }
} 