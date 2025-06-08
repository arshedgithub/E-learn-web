import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { NextRequest } from 'next/server';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class ValidationError extends Error {
    constructor(message: string, public errors: any[]) {
        super(message);
        this.name = 'ValidationError';
    }
}

export interface ValidationSchema {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
}

export function createValidator<T>(schema: ValidationSchema) {
    const validate = ajv.compile(schema);
    
    return (data: unknown): T => {
        const valid = validate(data);
        if (!valid) {
            throw new ValidationError('Validation failed', validate.errors || []);
        }
        return data as T;
    };
}

export async function validateRequest<T>(
    req: NextRequest,
    schema: ValidationSchema
): Promise<T> {
    try {
        const json = await req.json();
        const validate = createValidator<T>(schema);
        return validate(json);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new ValidationError('Invalid request format', []);
    }
}

// Common validation schemas
export const schemas = {
    login: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
        },
        required: ['email', 'password'],
        additionalProperties: false
    },
    register: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            username: { type: 'string', minLength: 3 },
            firstName: { type: 'string', minLength: 2 },
            lastName: { type: 'string', minLength: 2 }
        },
        required: ['email', 'password', 'username', 'firstName', 'lastName'],
        additionalProperties: false
    },
    forgotPassword: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' }
        },
        required: ['email'],
        additionalProperties: false
    },
    resetPassword: {
        type: 'object',
        properties: {
            code: { type: 'string', minLength: 6 },
            password: { type: 'string', minLength: 6 }
        },
        required: ['code', 'password'],
        additionalProperties: false
    },
    updateProfile: {
        type: 'object',
        properties: {
            firstName: { type: 'string', minLength: 2 },
            lastName: { type: 'string', minLength: 2 },
            bio: { type: 'string', maxLength: 500 },
            profilePicture: { type: 'string', format: 'uri' }
        },
        required: [],
        additionalProperties: false
    },
    changeUserStatus: {
        type: 'object',
        properties: {
            userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
            status: { type: 'string', enum: ['active', 'inactive', 'blocked'] }
        },
        required: ['userId', 'status'],
        additionalProperties: false
    }
};
