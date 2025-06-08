import mongoose from "mongoose";
import { USER_ROLE } from "@/types";

export interface IAuth {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    status: USER_ROLE;
    refreshToken: string;
    forgetPasswordCode: string;
    forgetPasswordCodeExpiry: Date;
    createdAt: Date;
    updatedAt: Date;
}