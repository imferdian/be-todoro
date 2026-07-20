import * as z from 'zod';

// Request DTO
// Untuk validasi request body
export const RegisterRequestSchema = z.object({
  name: z
    .string({ error: 'Name must be a string' })
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long')
    .meta({
      description: 'Nama Pengguna'
    }),
  email: z
    .email('Invalid email address')
    .meta({
      description: 'Alamat email yang akan digunakan untuk login'
    }),
  password: z
    .string({ error: 'Password must be a string' })
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .meta({
      description: 'Password minimal 6 karakter'
    })
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
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  };
}
