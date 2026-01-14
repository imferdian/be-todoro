import { generateToken } from '../../lib/utils/generateToken';
import { prisma } from '../../lib/prisma';
import { sign, verify } from 'jsonwebtoken';
import { LoginRequestDto, RegisterRequestDto } from './dtos';
import { AuthError } from './auth.error';
import { emailConfig, getResendClient } from '../../lib/resend';
import {
  generateVerificationEmail,
  generateVerificationEmailText,
} from './email/verification-email';

interface RegisterResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  expiresAt: Date;
}

interface LoginResult {
  token: string;
  expiresAt: Date;
}

// Register Services
export const register = async (
  dto: RegisterRequestDto
): Promise<RegisterResult> => {
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
  
  await sendVerificationEmail(user.email, user.name, user.id);

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
export const login = async (dto: LoginRequestDto): Promise<LoginResult> => {
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

// definisi isi dari token verifikasi
interface VerifyTokenPayload {
  userId: string;
  email: string;
  purpose: 'email_verification';
}

// generate token verifikasi
function generateVerificationToken(userId: string, email: string) {
  const expiryHours = parseInt(
    process.env.VERIFICATION_TOKEN_EXPIRY_HOURS || '24',
    10
  );

  const payload: VerifyTokenPayload = {
    userId,
    email,
    purpose: 'email_verification',
  };

  const secret =
    process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET_KEY!;

  return sign(payload, secret, {
    expiresIn: `${expiryHours}h`,
  });
}

// verifikasi token verifikasi
function verifyVerificationToken(token: string) {
  const secret =
    process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET_KEY!;

  try {
    const decoded = verify(token, secret) as VerifyTokenPayload;

    if (decoded.purpose !== 'email_verification') {
      throw new AuthError('Invalid verification token', 'INVALID_TOKEN');
    }
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthError(
        'Verification token has expired',
        'VERIFICATION_TOKEN_EXPIRED'
      );
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthError('Invalid verification token', 'INVALID_TOKEN');
    }
    throw error;
  }
}

// Kirim verifikasi email menggunakan Resend
export const sendVerificationEmail = async (
  email: string,
  name: string,
  userId: string
): Promise<void> => {
  const resend = getResendClient();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const appName = process.env.APP_NAME || 'Todoro';

  const token = generateVerificationToken(userId, email);
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
  const expiresIn = `${process.env.VERIFICATION_TOKEN_EXPIRY_HOURS || '24'} jam`;

  try {
    await resend.emails.send({
      from: emailConfig.from,
      to: email,
      subject: `Verifikasi Email Anda - ${appName}`,
      html: generateVerificationEmail({
        userName: name,
        verificationLink: verificationLink,
        expiresIn,
      }),
      text: generateVerificationEmailText({
        userName: name,
        verificationLink: verificationLink,
        expiresIn,
      }),
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new AuthError(
      'Failed to send verification email',
      'EMAIL_SEND_FAILED'
    );
  }
};

// Verifikasi email dengan JWT token
export const verifyEmail = async (
  token: string
): Promise<{ email: string }> => {
  // verifikasi jwt tokennya
  const payload = verifyVerificationToken(token);

  // cari user di database untuk pastikan masih ada
  const user = await prisma.users.findUnique({
    where: {
      id: payload.userId,
    },
  });

  // cek jika ada user
  if (!user) {
    throw new AuthError('User not found', 'USER_NOT_FOUND');
  }

  // cek apakah email cocok
  if (user.email !== payload.email) {
    throw new AuthError(
      'Email is already verified',
      'INVALID_VERIFICATION_TOKEN'
    );
  }

  if (user.isVerified) {
    throw new AuthError('Email already verified', 'EMAIL_ALREADY_VERIFIED');
  }

  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  return {
    email: user.email,
  };
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: {
      email
    }
  });
  
  if (!user) {
    throw new AuthError('User not found', 'USER_NOT_FOUND');
  }
  
  if (user.isVerified) {
    throw new AuthError('Email already verified', 'EMAIL_ALREADY_VERIFIED');
  }
  
  await sendVerificationEmail(user.email, user.name, user.id);
  
}

