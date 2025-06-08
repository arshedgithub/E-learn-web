export const resetPasswordDtoSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' }
    },
    required: ['email'],
    additionalProperties: false
};

export interface ResetPasswordDto {
    email: string;
} 