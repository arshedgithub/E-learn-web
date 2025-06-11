import { NextRequest } from 'next/server';
import { connectToDatabase } from './mongoose';

export const runtime = 'nodejs';

export function withDB(handler: (req: NextRequest) => Promise<Response>) {
    return async function(req: NextRequest) {
        try {
            await connectToDatabase();
            return handler(req);
        } catch (error) {
            console.error('Database connection error:', error);
            return new Response(
                JSON.stringify({ message: 'Database connection error' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    };
} 