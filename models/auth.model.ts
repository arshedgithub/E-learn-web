import mongoose, { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IAuth, USER_ROLE } from '@/types';
import { AppConfig } from '@/config';

const saltRounds: number = AppConfig.SALT;

const AuthSchema = new Schema<IAuth>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: '{VALUE} is not a valid user status'
      },
      required: true, 
      default: USER_ROLE.STUDENT
    },
    refreshToken: { type: String },
    forgetPasswordCode: {
      type: String,
      default: null,
    },
    forgetPasswordCodeExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    methods: {
      comparePasswords(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      },
    },
    timestamps: true,
  },
);

AuthSchema.pre('save', function (next) {
  let auth = this;

  bcrypt.hash(auth.password, saltRounds, function (err, hash) {
    if (err) return next(err);
    if (!hash) return next(new Error('Failed to generate hash'));
    auth.password = hash;
    next();
  });
});

AuthSchema.index({ email: 1 }, { unique: true });
export const Auth = mongoose.model<IAuth>('Auth', AuthSchema);
