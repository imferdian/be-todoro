import { sign } from 'jsonwebtoken';
import { jwt } from '@elysiajs/jwt'

export const generateToken = (userId: string, email: string) => {
  const expiresIn = 7 * 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + expiresIn * 1000) 
  const token = sign({ userId, email }, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });

  return { token, expiresAt };
};

export const verificationJwt = jwt({
  name: 'verifikasiJwt',
  secret: process.env.JWT_SECRET_KEY!,
  exp: '1h'
});