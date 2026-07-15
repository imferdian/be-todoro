import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { authRoutes } from './modules/auth/index';
import { taskRoutes } from './modules/tasks/index';
import { z } from 'zod'

const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
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
OpenAPI: http://${app.server?.hostname}:${app.server?.port}/openapi`
  );
}

export default app;
export type App = typeof app;