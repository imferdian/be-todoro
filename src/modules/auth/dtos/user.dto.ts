import * as z from 'zod';

export const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponseDto = z.infer<typeof UserResponseSchema>;

export const GetUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: UserResponseSchema,
  }),
});

export type GetUserResponseDto = z.infer<typeof GetUserResponseSchema>;

export function toUserDto(user: {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toGetUserResponse(user: {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): GetUserResponseDto {
  return {
    success: true,
    message: 'User retrieved successfully',
    data: {
      user: toUserDto(user),
    },
  };
}
