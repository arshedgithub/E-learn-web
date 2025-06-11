export const runtime = 'nodejs';

export { AppConfig } from './app.config';
export { BcryptConfig } from './bcrypt.config';
export { MONGOOSE_URL } from './mongoose.config';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '7d';
