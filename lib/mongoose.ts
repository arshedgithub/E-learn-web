import mongoose from 'mongoose';
import { MONGOOSE_URL } from '@/config';

const MONGODB_URI = MONGOOSE_URL!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGOOSE_URL environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    models: { [key: string]: mongoose.Model<any> };
}

declare global {
    var mongoose: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null, models: {} };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export function getModel<T>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
    if (cached.models[name]) {
        return cached.models[name] as mongoose.Model<T>;
    }

    const model = mongoose.model<T>(name, schema);
    cached.models[name] = model;
    return model;
} 