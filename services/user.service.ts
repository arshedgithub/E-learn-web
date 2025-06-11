import { User, Auth } from '@/models';
import { IUser, USER_STATUS, USER_ROLE } from '@/types';

export const runtime = 'nodejs';

export class UserService {
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser> {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers(adminId: string): Promise<IUser[]> {
        // Verify admin role
        const admin = await Auth.findById(adminId);
        if (!admin || admin.role !== USER_ROLE.ADMIN) {
            throw new Error('Unauthorized: Admin access required');
        }

        return User.find({});
    }

    async changeUserStatus(
        adminId: string,
        targetUserId: string,
        newStatus: USER_STATUS
    ): Promise<IUser> {
        // Verify admin role
        const admin = await Auth.findById(adminId);
        if (!admin || admin.role !== USER_ROLE.ADMIN) {
            throw new Error('Unauthorized: Admin access required');
        }

        // Prevent admin from changing their own status
        if (adminId === targetUserId) {
            throw new Error('Admin cannot change their own status');
        }

        const user = await User.findByIdAndUpdate(
            targetUserId,
            { $set: { status: newStatus } },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async searchUsers(
        adminId: string,
        searchTerm: string
    ): Promise<IUser[]> {
        // Verify admin role
        const admin = await Auth.findById(adminId);
        if (!admin || admin.role !== USER_ROLE.ADMIN) {
            throw new Error('Unauthorized: Admin access required');
        }

        // Search in multiple fields
        return User.find({
            $or: [
                { email: { $regex: searchTerm, $options: 'i' } },
                { username: { $regex: searchTerm, $options: 'i' } },
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }

    async getUserStats(adminId: string): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        blockedUsers: number;
    }> {
        // Verify admin role
        const admin = await Auth.findById(adminId);
        if (!admin || admin.role !== USER_ROLE.ADMIN) {
            throw new Error('Unauthorized: Admin access required');
        }

        const [totalUsers, activeUsers, inactiveUsers, blockedUsers] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ status: USER_STATUS.ACTIVE }),
            User.countDocuments({ status: USER_STATUS.INACTIVE }),
            User.countDocuments({ status: USER_STATUS.BLOCKED })
        ]);

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            blockedUsers
        };
    }
} 