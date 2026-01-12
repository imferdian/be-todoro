import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from '../src/modules/auth';

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Todoro API',
          version: '1.0.0',
          description: 'Pomodoro Task Management API',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Tasks', description: 'Task endpoints' },
          { name: 'Todos', description: 'Todo endpoints' },
        ],
      },
    })
  )
  // Health check
  .get('/', () => ({
    status: 'ok',
    message: 'Todoro API is running',
    timestamp: new Date().toISOString(),
  }))
  // API Routes
  .group('/api/v1', (app) => app
    .use(authRoutes));

export default app.fetch;
