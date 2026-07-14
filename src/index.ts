import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './modules/auth/index';
import { taskRoutes } from './modules/tasks/index';

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
  .get('/', () => ({
    status: 'ok',
    message: 'Todoro API is running',
    timestamp: new Date().toISOString(),
  }))
  .group('/api/v1', (app) => app.use(authRoutes).use(taskRoutes));

// Hanya listen kalau di lokal, BUKAN saat di-build/deploy Vercel
if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 5000);
  console.log(
    `Todoro API is running!
Server: http://${app.server?.hostname}:${app.server?.port}
Swagger: http://${app.server?.hostname}:${app.server?.port}/swagger`
  );
}

export default app;
export type App = typeof app;