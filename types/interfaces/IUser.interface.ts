import mongoose from "mongoose";
import { USER_STATUS } from "@/types";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    status: USER_STATUS;
    profilePicture?: string;
    bio?: string;
    isVerified: boolean;
    lastLogin?: Date;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}