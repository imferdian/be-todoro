import * as z from 'zod';

// Request DTO
// Untuk validasi request body
export const RegisterRequestSchema = z.object({
  name: z
    .string({ error: 'Name must be a string' })
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string({ error: 'Password must be a string' })
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

// Typescript Type infer dari schema
export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

// Response DTO
// Untuk validasi response
export const RegisterResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.union([
    z.object({
      token: z.jwt(),
      user: z.object({
        id: z.uuid(),
        email: z.email(),
        isVerified: z.boolean(),
        name: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    }),
    z.null(),
  ]),
});

export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;

// Transform entitas database ke response DTO
export function toRegisteredResponse(
  token: string,
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
): RegisterResponseDto {
  return {
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  };
}
