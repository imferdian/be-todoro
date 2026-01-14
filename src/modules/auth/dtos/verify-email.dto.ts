import * as z from 'zod';

// Request DTO = Query parameter untuk verifikasi email
export const VerifyEmailQuerySchema = z.object({
  token: z.jwt({ error: 'Verification token is required' }),
});

export type VerifyEmailQueryDto = z.infer<typeof VerifyEmailQuerySchema>;

// Response DTO
export const VerifyEmailResponeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    email: z.string(),
    isVerified: z.literal(true),
  }),
});

export type VerifyEmailResponseDto = z.infer<typeof VerifyEmailResponeSchema>;

// Resend verification email request DTO
export const ResendVerificationRequestSchema = z.object({
  email: z.email({ error: 'invalid email format' }),
});

export type ResendVerificationRequestDto = z.infer<
  typeof ResendVerificationRequestSchema
>;

export const toVerifyEmailResponse = (
  email: string
): VerifyEmailResponseDto => {
  return {
    success: true,
    message: 'email verified id successfully',
    data: {
      email,
      isVerified: true,
    },
  };
};
