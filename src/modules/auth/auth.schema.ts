import * as z from 'zod';

// Request Schema 

export const RegisterBodySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

export const LoginBodySchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

export const ForgotPasswordBodySchema = z.object({
  email: z.email('Invalid email address'),
});

// export const ResetPasswordBodySchema = z.object({
//   token: z.jwt('Invalid token'),
//   password: z
//     .string()
//     .min(6, 'Password must be at least 6 characters long')
//     .max(100, 'Password must be at most 100 characters long'),
// });

// Response Schema

export const UserPayloadSchema = z.object({
  id: z.uuid('invalid user id'),
  email: z.email('invalid email address'),
  name: z.string(),
})

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.union([
    z.object({
      token: z.jwt(),
      user: UserPayloadSchema,
    }),
    z.null(),
  ])
})

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string(),
})

export const UserIdParamSchema = z.object({
  id: z.uuid('invalid user id'),
})