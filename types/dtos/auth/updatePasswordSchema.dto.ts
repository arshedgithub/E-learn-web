export const updatePasswordDtoSchema = {
    type: 'object',
    properties: {
        token: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 6 }
    },
    required: ['token', 'password'],
    additionalProperties: false
};

export interface UpdatePasswordDto {
    token: string;
    password: string;
} 