import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { loginDtoSchema, LoginDto } from '@/types';
import { 
    setAuthCookie, 
    validate, 
    errorResponse, 
    successResponse, 
    withDB 
} from '@/lib';

export const runtime = 'nodejs';

const authService = new AuthService();

export const POST = withDB(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, password } = validate<LoginDto>(loginDtoSchema, body);
        const { user, token } = await authService.login(email, password);
        
        const response = successResponse({user, token});
        return setAuthCookie(response, token);
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(
            error instanceof Error ? error.message : 'Authentication failed',
            401
        );
    }
}); 