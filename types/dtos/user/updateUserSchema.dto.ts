export const updateUserDtoSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', minLength: 3 },
        firstName: { type: 'string', minLength: 2 },
        lastName: { type: 'string', minLength: 2 },
        bio: { type: 'string', maxLength: 500 },
        avatar: { type: 'string', format: 'uri' }
    },
    required: ['username', 'firstName', 'lastName'],
    additionalProperties: false
};

export interface UpdateUserDto {
    username: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
} 