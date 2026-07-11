import { Elysia, ValidationError } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { TaskError } from './task.error';
import { AuthError } from '../auth/auth.error';
import {
  createTaskController,
  deleteTaskController,
  getAllTaskController,
  getTaskController,
  updateTaskController,
} from './task.controller';
import {
  CreateTaskRequestSchema,
  UpdateTaskRequestSchema,
} from './dtos';
import z from 'zod';

const TaskIdParamsSchema = z.object({
  taskId: z.uuid(),
})

export const taskRoutes = new Elysia({ prefix: '/tasks' })
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      const validationError = error as ValidationError;

      return {
        success: false,
        message: 'Validation error',
        code: code || 'VALIDATION_ERROR',
        detail: validationError.all,
      };
    }

    if (error instanceof TaskError) {
      set.status = error.statusCode;
      return error.toDto();
    }

    // Handle auth errors from middleware
    if (error instanceof AuthError) {
      set.status = error.statusCode;
      return error.toDto();
    }

    console.error('Unexpected error:', error);
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    };
  })

  .use(authMiddleware)

  .get('/', getAllTaskController as any, {
    detail: {
      tags: ['Task'],
      summary: 'Get all tasks',
      description: 'Get all tasks',
    },
  })

  .get('/:taskId', getTaskController as any, {
    detail: {
      tags: ['Task'],
      summary: 'Get task by id',
      description: 'Get task by id',
    },
  })

  .post('/', createTaskController as any, {
    body: CreateTaskRequestSchema,
    detail: {
      tags: ['Task'],
      summary: 'Create task',
      description: 'Create new task',
    },
  })

  .patch('/:taskId', updateTaskController as any, {
    params: TaskIdParamsSchema,
    body: UpdateTaskRequestSchema,
    detail: {
      tags: ['Task'],
      summary: 'Update task',
      description: 'Update task',
    },
  })

  .delete('/:taskId', deleteTaskController as any, {
    params: TaskIdParamsSchema,
    detail: {
      tags: ['Task'],
      summary: 'Delete task',
      description: 'Delete task',
    },
  });
