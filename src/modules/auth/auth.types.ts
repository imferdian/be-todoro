export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: UserPayload;
  } | null;
}

export interface JWTPayload {
  userId: string;
  email: string;
  exp: number;
}


export type AuthErrorCode =
  'INVALID_CREDENTIALS' |
  'USER_EXISTS' |
  'USER_NOT_FOUND' |
  'INVALID_TOKEN' |
  'TOKEN_EXPIRED' |
  'UNAUTHORIZED';



export class AuthError extends Error {
  public readonly statusCode: number;
  
  constructor (
    message: string,
    public readonly code: AuthErrorCode,
    statusCode?: number
  ){
    super(message);
    this.name = 'AuthError';

    const statusMap: Record<AuthErrorCode, number> = {
      INVALID_CREDENTIALS: 401,
      USER_EXISTS: 409,
      USER_NOT_FOUND: 404,
      INVALID_TOKEN: 401,
      TOKEN_EXPIRED: 401,
      UNAUTHORIZED: 401
    };
    
    this.statusCode = statusCode ?? statusMap[code] ?? 500;
  }
}
