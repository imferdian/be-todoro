import { Context, Elysia, RouteSchema, ValidationError } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { TaskError } from './task.error';
import { AuthError } from '../auth/auth.error';
import {
  CreateTaskRequestDto,
  CreateTaskRequestSchema,
  GetTaskParamsDto,
  toCreateTaskDto,
  toDeleteTaskDto,
  toGetAllTaskDto,
  toTaskDto,
  toUpdateTaskDto,
  UpdateTaskRequestDto,
  UpdateTaskRequestSchema,
} from './dtos';
import z from 'zod';
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from './task.services';

type AuthenticatedContext<T extends RouteSchema ={}> = Context<T> & {
  userId: string;
  userEmail: string;
}

type GetAllTaskContext = AuthenticatedContext

type GetTaskContext = AuthenticatedContext<{
  params: GetTaskParamsDto
}>;

type CreateTaskContext = AuthenticatedContext<{
  body: CreateTaskRequestDto;
}>

type UpdateTaskContext = AuthenticatedContext<{
  body: UpdateTaskRequestDto
}>

type DeleteTaskContext = AuthenticatedContext<{
  params: GetTaskParamsDto
}>;

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

  .get('/', async ({userId, set}: GetAllTaskContext) => {
    const results = await getAllTasks(userId);

    set.status = 200;
    return toGetAllTaskDto(results);
  }, {
    detail: {
      tags: ['Task'],
      summary: 'Get all tasks',
      description: 'Get all tasks',
    },
  })

  .get('/:taskId', async ({params, userId, set}: GetTaskContext) => {
      const result = await getTask(params, userId)

      set.status = 200;
      return toTaskDto(result);
  }, {
    detail: {
      tags: ['Task'],
      summary: 'Get task by id',
      description: 'Get task by id',
    },
  })

  .post('/', async ({body, set, userId}: CreateTaskContext) => {
      const result = await createTask(body, userId);

      set.status = 201;
      return toCreateTaskDto(result);
  }, {
    body: CreateTaskRequestSchema,
    detail: {
      tags: ['Task'],
      summary: 'Create task',
      description: 'Create new task',
    },
  })

  .patch('/:taskId', async ({body, userId, set}: UpdateTaskContext) => {
      const result = await updateTask(body, userId);

      set.status = 200;
      return toUpdateTaskDto(result);
  }, {
    params: TaskIdParamsSchema,
    body: UpdateTaskRequestSchema,
    detail: {
      tags: ['Task'],
      summary: 'Update task', 
      description: 'Update task',
    },
  })

  .delete('/:taskId', async ({params, userId, set}: DeleteTaskContext) => {
    await deleteTask(params.taskId, userId)
    
    set.status = 200;
    return toDeleteTaskDto();
  }, {
    params: TaskIdParamsSchema,
    detail: {
      tags: ['Task'],
      summary: 'Delete task',
      description: 'Delete task',
    },
  });
