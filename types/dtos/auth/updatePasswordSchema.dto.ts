export const updatePasswordDtoSchema = {
    type: 'object',
    properties: {
        currentPassword: { type: 'string', minLength: 6 },
        newPassword: { type: 'string', minLength: 6 }
    },
    required: ['currentPassword', 'newPassword'],
    additionalProperties: false
};

export interface UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
} 