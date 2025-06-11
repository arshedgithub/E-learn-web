import bcrypt from 'bcryptjs';
import { User, Auth } from '@/models';
import { USER_STATUS, USER_ROLE } from '@/types';
import { generateToken } from '@/lib';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export class AuthService {
    async register(
        email: string,
        password: string,
        username: string,
        firstName: string,
        lastName: string
    ) {
        // Check if user already exists
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create auth record
        const auth = await Auth.create({
            email,
            password,
            username,
            role: USER_ROLE.STUDENT
        });

        // Create user profile
        const user = await User.create({
            email,
            username,
            firstName,
            lastName,
            status: USER_STATUS.ACTIVE
        });

        // Generate JWT token
        const token = generateToken({
            userId: auth._id.toString(),
            email: auth.email,
            role: auth.role
        });

        return { user, token };
    }

    async login(email: string, password: string) {
        // Find auth record
        const auth = await Auth.findOne({ email });
        if (!auth) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, auth.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Get user profile
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User profile not found');
        }

        // Generate JWT token
        const token = generateToken({
            userId: auth._id.toString(),
            email: auth.email,
            role: auth.role
        });

        return { user, token };
    }

    async forgotPassword(email: string) {
        const auth = await Auth.findOne({ email });
        if (!auth) {
            // Don't reveal if email exists
            return;
        }

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // 1 hour expiry

        await Auth.findByIdAndUpdate(auth._id, {
            forgetPasswordCode: code,
            forgetPasswordCodeExpiry: expiry
        });

        // TODO: Send email with code
        return code;
    }

    async resetPassword(code: string, newPassword: string) {
        const auth = await Auth.findOne({
            forgetPasswordCode: code,
            forgetPasswordCodeExpiry: { $gt: new Date() }
        });

        if (!auth) {
            throw new Error('Invalid or expired code');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Auth.findByIdAndUpdate(auth._id, {
            password: hashedPassword,
            forgetPasswordCode: null,
            forgetPasswordCodeExpiry: null
        });
    }

    async updateUser(userId: string, updateData: {
        username: string;
        firstName: string;
        lastName: string;
        bio?: string;
        avatar?: string;
    }) {
        // Check if username is already taken by another user
        const existingUser = await User.findOne({
            username: updateData.username,
            _id: { $ne: userId }
        });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Update user profile
        const user = await User.findByIdAndUpdate(
            userId,
            {
                username: updateData.username,
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                bio: updateData.bio,
                avatar: updateData.avatar
            },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        // Update auth record username
        await Auth.findOneAndUpdate(
            { email: user.email },
            { username: updateData.username }
        );

        return user;
    }

    async updatePassword(req: NextRequest, currentPassword: string, newPassword: string) {
        // Get user ID from token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        // Find auth record
        const auth = await Auth.findOne({ _id: token });
        if (!auth) {
            throw new Error('User not found');
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, auth.password);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Auth.findByIdAndUpdate(auth._id, { password: hashedPassword });
    }
} 