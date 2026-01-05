import { generateToken } from '../../lib/utils/generateToken';
import { prisma } from '../../lib/prisma';
import {
  RegisterInput,
  LoginInput,
  UserPayload,
  AuthError,
} from './auth.types';
import { verify } from 'jsonwebtoken';

// jangan ambil password
function excludePassword(user: {
  id: string;
  name: string;
  email: string;
  password: string;
}): UserPayload {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Register Services
export const register = async (
  input: RegisterInput
): Promise<{ token: string; user: UserPayload }> => {
  const existingUser = await prisma.users.findUnique({
    where: { email: input.email },
  });

  // cek kalau sudah ada user
  if (existingUser) {
    throw new AuthError('Email already exists', 'USER_EXISTS');
  }

  // hash password
  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  // buat user
  const user = await prisma.users.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  // generate token
  const token = generateToken(user.id, user.email);

  // return token dan user
  return {
    token,
    user: excludePassword(user),
  };
};

// Login Services
export const login = async (
  input: LoginInput
): Promise<{
  token: string;
  user: UserPayload;
}> => {
  // Ambil user berdasarkan email
  const user = await prisma.users.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AuthError('Email not found', 'INVALID_CREDENTIALS');
  }

  // Verifikasi Password
  const isValidPassword = await Bun.password.verify(
    input.password,
    user.password
  );

  if (!isValidPassword) {
    throw new AuthError('Invalid password', 'INVALID_CREDENTIALS');
  }

  // Generate Token
  const token = generateToken(user.id, user.email);

  // return token dan user
  return {
    token,
    user: excludePassword(user),
  };
};

// Get user
export const getUserById = async (userId: string): Promise<UserPayload> => {
  // ambil user berdasarkan id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AuthError('User not found', 'USER_NOT_FOUND');
  }

  return excludePassword(user);
};

// Verifikasi token JWT
export const verifyToken = async (token: string) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    return decoded;
  } catch (err) {
    throw new AuthError('Invalid or expired token', 'INVALID_TOKEN');
  }
};