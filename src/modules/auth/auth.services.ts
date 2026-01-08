import { generateToken } from '../../lib/utils/generateToken';
import { prisma } from '../../lib/prisma';
import { verify } from 'jsonwebtoken';
import { LoginRequestDto, RegisterRequestDto } from './dtos';
import { AuthError } from './auth.error';

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  expiresAt: Date;
}

// Register Services
export const register = async (
  dto: RegisterRequestDto
): Promise<AuthResult> => {
  // cek kalau sudah ada user
  const existingUser = await prisma.users.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new AuthError('Email already exists', 'USER_EXISTS');
  }

  // hash password
  const hashedPassword = await Bun.password.hash(dto.password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  // buat user
  const user = await prisma.users.create({
    data: {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    },
  });

  // generate token
  const { token, expiresAt } = generateToken(user.id, user.email);

  // return token dan user
  return {
    token,
    user,
    expiresAt,
  };
};

// Login Services
export const login = async (dto: LoginRequestDto): Promise<AuthResult> => {
  // Ambil user berdasarkan email
  const user = await prisma.users.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new AuthError('Email not found', 'INVALID_CREDENTIALS');
  }

  // Verifikasi Password
  const isValidPassword = await Bun.password.verify(
    dto.password,
    user.password
  );

  if (!isValidPassword) {
    throw new AuthError('Invalid password', 'INVALID_CREDENTIALS');
  }

  // Generate Token
  const { token, expiresAt } = generateToken(user.id, user.email);

  // return token dan user
  return {
    token,
    user,
    expiresAt,
  };
};

// Get user
export const getUserById = async (userId: string) => {
  // ambil user berdasarkan id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AuthError('User not found', 'USER_NOT_FOUND');
  }
  return user;
};

// Verifikasi token JWT
export const verifyToken = async (token: string) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (err) {
    throw new AuthError('Invalid or expired token', 'INVALID_TOKEN');
  }
};
