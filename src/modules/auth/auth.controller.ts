import { authServices } from '.';
import type { Context } from 'elysia';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ResendVerificationRequestDto,
  toGetUserResponse,
  toLoginResponse,
  toRegisteredResponse,
  toVerifyEmailResponse,
  VerifyEmailQueryDto,
  VerifyEmailResponseDto,
} from './dtos';
import { AuthError } from './auth.error';

type RegisterContext = Context<{
  body: RegisterRequestDto;
}>;

type LoginContext = Context<{
  body: LoginRequestDto;
}>;

type AuthenticatedContext = Context<{
  headers: {
    authorization?: string;
  };
}>;

type ResendVerificationEmail = Context<{
  body: ResendVerificationRequestDto;
}>;

type VerifyEmail = Context<{
  query: VerifyEmailQueryDto;
}>;

// POST /auth/register - Register controller
export const registerController = async ({ body, set }: RegisterContext) => {
  const result = await authServices.register(body);

  set.status = 201;
  return toRegisteredResponse(result.token, result.user);
};

// POST /auth/login - Login controller
export const loginController = async ({ body }: LoginContext) => {
  const result = await authServices.login(body);

  return toLoginResponse(result.token, result.user, result.expiresAt);
};

// GET /auth/me - Get user controller
export const getMeController = async ({ headers }: AuthenticatedContext) => {
  // extract dan verifikasi token
  const authHeader = headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Authorization required', 'UNAUTHORIZED');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = await authServices.verifyToken(token);
  // ambil user dari services
  const user = await authServices.getUserById(decoded.userId);

  return toGetUserResponse(user);
};

export const getVerificationEmailController = async ({
  query,
}: VerifyEmail) => {
  const result = await authServices.verifyEmail(query.token);
  return toVerifyEmailResponse(result.email);
};

export const resendVerificationController = async ({
  body,
  set,
}: ResendVerificationEmail) => {
  await authServices.resendVerificationEmail(body.email);
  set.status = 200;
  return {
    success: true,
    message: 'Verification emaiol has been resent',
  };
};
