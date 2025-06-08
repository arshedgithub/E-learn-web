import mongoose from "mongoose";
import { USER_STATUS } from "@/types";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    role: USER_STATUS;
    createdAt: Date;
    updatedAt: Date;
}