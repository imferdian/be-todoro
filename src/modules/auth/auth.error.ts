export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_EXISTS'
  | 'USER_NOT_FOUND'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'UNAUTHORIZED'
  | 'EMAIL_ALREADY_VERIFIED'
  | 'INVALID_VERIFICATION_TOKEN'
  | 'EMAIL_SEND_FAILED'
  | 'VERIFICATION_TOKEN_EXPIRED';

const HTTP_STATUS_MAP: Record<AuthErrorCode, number> = {
  INVALID_CREDENTIALS: 401,
  USER_EXISTS: 409,
  USER_NOT_FOUND: 404,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  UNAUTHORIZED: 403,
  EMAIL_ALREADY_VERIFIED: 400,
  EMAIL_SEND_FAILED: 500,
  INVALID_VERIFICATION_TOKEN: 400,
  VERIFICATION_TOKEN_EXPIRED: 400,
};

export class AuthError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    public readonly code: AuthErrorCode,
    statusCode?: number
  ) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode ?? HTTP_STATUS_MAP[code] ?? 500;
  }
  toDto() {
    return {
      success: false as const,
      message: this.message,
      code: this.code,
    };
  }
}
