import { Elysia, ValidationError } from 'elysia';
import {
  registerController,
  loginController,
  getMeController,
  getVerificationEmailController,
  resendVerificationController,
} from './auth.controller';
import { AuthError } from './auth.error';

import {
  ErrorResponseSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  ResendVerificationRequestSchema,
  VerifyEmailQuerySchema,
  VerifyEmailResponeSchema,
} from './dtos';
import { resendVerificationEmail } from './auth.services';

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
    }
  })

  // POST /auth/register
  .post('/register', registerController, {
    body: RegisterRequestSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description: 'Create a new user account with email and password',
    },
  })

  // POST /auth/login
  .post('/login', loginController, {
    body: LoginRequestSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticate user with email and password',
    },
  })

  // GET /auth/me
  .get('/me', getMeController, {
    detail: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get the currently authenticated user profile',
      security: [{ bearerAuth: [] }],
    },
  });
