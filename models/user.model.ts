import mongoose, { Schema } from 'mongoose';
import { IUser, USER_STATUS } from '@/types';

const UserSchema = new Schema<IUser>(
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
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema); 