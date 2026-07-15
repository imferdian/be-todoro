import { Context, Elysia, ValidationError } from 'elysia';
import {
  registerController,
  loginController,
  getMeController,
  getVerificationEmailController,
  resendVerificationController,
  logoutController,
} from './auth.controller';
import { AuthError } from './auth.error';

import {
  LoginRequestDto,
  LoginRequestSchema,
  RegisterRequestDto,
  RegisterRequestSchema,
  ResendVerificationRequestSchema,
  toGetUserResponse,
  toLoginResponse,
  toRegisteredResponse,
  VerifyEmailQuerySchema,
} from './dtos';
import { authServices } from '.';

type RegisterContext = Context<{
  body: RegisterRequestDto;
}>;

type LoginContext = Context<{
  body: LoginRequestDto;
}>

type AuthenticatedContext = Context<{
  headers: {
    authorization?: string;
  }
}>

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Handle Error
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      const validationError = error as ValidationError;

      return {
        success: false,
        message: 'Validation_error',
        code: code || 'VALIDATION_ERROR',
        detail: validationError.all,
      };
    }

    // Handle error pakai AuthError
    if (error instanceof AuthError) {
      set.status = error.statusCode;
      return error.toDto();
    }

    console.error('Unexpected error:', error);
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  })

  // GET /auth/verify-email
  .get('/verify-email', getVerificationEmailController, {
    query: VerifyEmailQuerySchema,
    detail: {
      tags: ['Auth'],
      summary: 'Verify email',
      description: 'Verify email address',
    },
  })

  .post('/resend-verification', resendVerificationController, {
    body: ResendVerificationRequestSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Resend verification email',
      description: 'Resend verification email to the user',
    },
  })

  // POST /auth/register
  .post('/register', async ({ body, set }: RegisterContext) => {
    const result = await authServices.register(body);
  
    set.status = 201;
    return toRegisteredResponse(result.token, result.user);
  }, {
    body: RegisterRequestSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description: 'Create a new user account with email and password',
    },
  })

  // POST /auth/login
  .post('/login', async ({ body }: LoginContext) => {
    const result = await authServices.login(body);

    return toLoginResponse(result.token, result.expiresAt);
  }, {
    body: LoginRequestSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticate user with email and password',
    },
  })

  // GET /auth/me
  .get('/me', async ({ headers }: AuthenticatedContext) => {
    const authHeader = headers.authorization;

    if (!authHeader?.startsWith('Bearer')){
      throw new AuthError('Authorization required', 'UNAUTHORIZED')
    }

    const token = authHeader.replace('Bearer ', '');
    const decode = await authServices.verifyToken(token)

    const user = await authServices.getUserById(decode.userId);

    return toGetUserResponse(user);
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get the currently authenticated user profile',
      security: [{ bearerAuth: [] }],
    },
  })
  
  .post('/logout', async ({headers}: AuthenticatedContext) => {
      const authHeader = headers.authorization;

      if(!authHeader?.startsWith('Bearer ')){
        throw new AuthError('Authorization required','UNAUTHORIZED')
      }

      const token = authHeader.replace('Bearer ','')
      await authServices.logout(token);
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'Logout user',
      description: 'Logout the currently authenticated user',
      security: [{ bearerAuth: [] }],
    },
  })
