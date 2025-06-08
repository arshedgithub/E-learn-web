export const registerDtoSchema = {
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
};

export interface RegisterDto {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}
