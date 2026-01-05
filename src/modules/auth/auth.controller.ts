import { Elysia } from 'elysia';
import * as authServices from './auth.services';
import { AuthError } from './auth.types';
import {
  RegisterBodySchema,
  LoginBodySchema,
  AuthResponseSchema,
  ErrorResponseSchema,
} from './auth.schema';

export const authController = new Elysia({ prefix: '/auth' })
  // Error handler
  .onError(({ error, set }) => {
    if (error instanceof AuthError) {
      set.status = error.statusCode;
      return {
        succes: false,
        message: error.message,
        code: error.code,
      };
    }

    console.error('Unexpected error:', error);
    set.status = 500;
    return {
      success: false,
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    };
  })

  // Post /auth/register - Registrasi user baru
  .post('/register', async({ body, set }) => {
    const result = await authServices.register({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    set.status = 201;
    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  },
  {
    body: RegisterBodySchema,
    response: {
      201: AuthResponseSchema,
      409: ErrorResponseSchema,
    },
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description: 'Create a new user account with email and password'
    },
  })

  // Post /auth/login - Login user
  .post('/login', async ({ body }) => {
    const result = await authServices.login({
      email: body.email,
      password: body.password
    })
    return {
      success: true,
      message: 'User login successfully',
      data: result,
    }
  },
  {
    body: LoginBodySchema,
    response: {
      200: AuthResponseSchema,
      401: ErrorResponseSchema,
    },
    detail: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Login user with email and password'
    },
  })
  
  // GET /auth/me - Get current user
  .get('/me', async ({ headers, set }) => {
    
    const authHeader = headers.authorization;
    
    if(!authHeader || !authHeader?.startsWith('Bearer ')){
      throw new AuthError('Authorization header required', 'UNAUTHORIZED')
    };
    
    const token = authHeader.replace('Bearer', '');
    const decoded = await authServices.verifyToken(token);
    const user = await authServices.getUserById(decoded.userId);
    
    set.status = 200;
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };   
  },
  {
    detail: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get the currently authenticated user profile'
    }
  })


