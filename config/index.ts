export * from './app.config';
export * from './bcrypt.config';
export * from './mongoose.config';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '7d';
