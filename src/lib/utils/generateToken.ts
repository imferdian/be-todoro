import { sign } from 'jsonwebtoken';

export const generateToken = (userId: string, email: string) => {
  const token = sign(
    { userId, email }, 
    process.env.JWT_SECRET_KEY!,
    { expiresIn: '1h' }
  )
  
  return token;
}