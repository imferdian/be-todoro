import * as z from 'zod';

// Request DTO
// Untuk validasi login body
export const LoginRequestSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

// Typescript type infer dari schema
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

// Response DTO
export const LoginResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    token: z.jwt(),
    user: z.object({
      id: z.uuid(),
      name: z.string(),
      email: z.email(),
      isVerified: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
    expiresAt: z.date(),
  }),
});

export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;

export function toLoginResponse(
  token: string,
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  },
  expiresAt: Date
): LoginResponseDto {
  return {
    success: true,
    message: 'Login successfully',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      expiresAt,
    },
  };
}
