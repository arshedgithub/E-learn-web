import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { IValidationSchema } from '@/types';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class ValidationError extends Error {
    constructor(message: string, public errors: any[]) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validate<T>(schema: IValidationSchema, data: unknown): T {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
        throw new ValidationError('Validation failed', validate.errors || []);
    }
    
    return data as T;
}