import { Elysia } from 'elysia';
import { authServices } from '../modules/auth';
import { AuthError } from '../modules/auth/auth.error';

/**
 * Auth Middleware Plugin untuk Elysia
 * 
 * Menggunakan `.guard()` untuk memvalidasi auth
 * sebelum handler dijalankan.
 * 
 * Usage:
 * ```ts
 * import { authMiddleware } from '../../middleware/auth';
 * 
 * const protectedRoutes = new Elysia()
 *   .use(authMiddleware)
 *   .get('/protected', ({ store }) => {
 *     // userId tersedia dari store.userId
 *     return { userId: store.userId };
 *   });
 * ```
 */
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive({ as: 'scoped' }, async ({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('Authorization required', 'UNAUTHORIZED');
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = await authServices.verifyToken(token);
      
      return {
        userId: decoded.userId,
        userEmail: decoded.email,
      };
    } catch (error) {
      throw new AuthError('Invalid or expired token', 'INVALID_TOKEN');
    }
  });

// Type untuk digunakan di routes lain
export type AuthContext = {
  userId: string;
  userEmail: string;
};
