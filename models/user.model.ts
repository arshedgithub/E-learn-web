import mongoose from 'mongoose';
import { getModel } from '@/lib/mongoose';
import { IUser, USER_STATUS } from '@/types';

export const runtime = 'nodejs';

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: '{VALUE} is not a valid user role'
      },
      required: true,
      default: USER_STATUS.ACTIVE
    },
    profilePicture: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    avatar: { type: String }
  },
  {
    timestamps: true,
  }
);

export const User = getModel<IUser>('User', UserSchema); 