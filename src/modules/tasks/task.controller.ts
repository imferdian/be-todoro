import type { Context, RouteSchema } from 'elysia';
import type { CreateTaskRequestDto, GetAllTaskResponseDto, GetTaskParamsDto, UpdateTaskRequestDto } from './dtos';
import { toCreateTaskDto, toDeleteTaskDto, toGetAllTaskDto, toTaskDto, toUpdateTaskDto } from './dtos';
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from './task.services';
import { IdParamsDto } from '../auth';

// INFO: menambahkan 
type AuthenticatedContext<T extends RouteSchema = {}> = Context<T> & {
  userId: string;
  userEmail: string;
};

type CreateTaskContext = AuthenticatedContext<{
  body: CreateTaskRequestDto;
}>;

type UpdateTaskContext = AuthenticatedContext<{
  body: UpdateTaskRequestDto
}>

type DeleteTaskContext = AuthenticatedContext<{
  params: IdParamsDto
}>

type GetTaskContext = AuthenticatedContext<{
  params: GetTaskParamsDto
}>

type GetAllTaskContext = AuthenticatedContext

export const getTaskController = async ({ params, userId, set }: GetTaskContext) => {
  const result = await getTask(params, userId);
  
  set.status = 200;
  return toTaskDto(result);
}

export const getAllTaskController = async ({ userId, set }: GetAllTaskContext) => {
  const result = await getAllTasks(userId);
  
  set.status = 200;
  return toGetAllTaskDto(result);
}

export const createTaskController = async ({ body, userId, set }: CreateTaskContext) => {
  const result = await createTask(body, userId);
  
  set.status = 201;
  return toCreateTaskDto(result);
};

export const updateTaskController = async ({ body, userId, set }: UpdateTaskContext) => {
  const result = await updateTask(body, userId);
  
  set.status = 200;
  return toUpdateTaskDto(result);
}

export const deleteTaskController = async ({params, userId, set}: DeleteTaskContext) => {
  await deleteTask(params.id, userId)
  
  set.status = 200;
  return toDeleteTaskDto();
}