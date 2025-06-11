export const resetPasswordDtoSchema = {
    type: 'object',
    properties: {
        token: { type: 'string', minLength: 1 },
        newPassword: { type: 'string', minLength: 6 }
    },
    required: ['token', 'newPassword'],
    additionalProperties: false
};

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
} 