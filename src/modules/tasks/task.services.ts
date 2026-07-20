import { prisma } from '../../lib/prisma';
import {
  CreateTaskRequestDto,
  GetTaskParamsDto,
  UpdateTaskRequestDto,
} from './dtos';
import { TaskError } from './task.error';

interface TaskResult {
  id: string;
  title: string;
  description: string | undefined;
}

// INFO: Ambil salah satu task berdasarkan ID dan userID
export const getTask = async (
  dto: GetTaskParamsDto,
  userId: string
): Promise<TaskResult> => {
  const task = await prisma.tasks.findUnique({
    where: {
      id: dto.taskId,
    },
  });

  if (!task) {
    throw new TaskError('Task not found', 'TASK_NOT_FOUND');
  }

  if (task.userId !== userId) {
    throw new TaskError('Unauthorized', 'UNAUTHORIZED');
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
  };
};

// INFO: Ambil semua task berdasarkan userID
export const getAllTasks = async (userId: string): Promise<TaskResult[]> => {
  const tasks = await prisma.tasks.findMany({
    where: {
      userId,
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
  }));
};

// INFO: Buat task baru berdasarkan userId
export const createTask = async (
  dto: CreateTaskRequestDto,
  userId: string
): Promise<TaskResult> => {
  const existingTask = await prisma.tasks.findUnique({
    where: {
      title_userId: {
        title: dto.title,
        userId: userId,
      },
    },
  });

  if (existingTask) {
    throw new TaskError('Task already exists', 'TASK_ALREADY_EXISTS');
  }

  const task = await prisma.tasks.create({
    data: {
      title: dto.title,
      description: dto.description || '',
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return {
    id: task.id,
    title: task.title,
    description: task.description,
  };
};

// INFO: Update task berdasarkan id dan userId
export const updateTask = async (
  dto: UpdateTaskRequestDto,
  userId: string
): Promise<TaskResult> => {
  const task = await prisma.tasks.findUnique({
    where: {
      title_userId: {
        title: dto.title || '',
        userId,
      },
    },
  });

  if (!task) {
    throw new TaskError('Task not found', 'TASK_NOT_FOUND');
  }

  if (task.userId !== userId) {
    throw new TaskError('Unauthorized', 'UNAUTHORIZED');
  }

  if (dto.title === task.title && dto.description === task.description) {
    throw new TaskError('Task not changed', 'TASK_ALREADY_EXISTS');
  }

  const updateTask = await prisma.tasks.update({
    where: {
      id: task.id,
    },
    data: {
      title: dto.title,
      description: dto.description || undefined,
    },
  });

  return {
    id: updateTask.id,
    title: updateTask.title,
    description: updateTask.description,
  };
};

// INFO: Hapus task berdasarkan id dan userId
export const deleteTask = async (id: string, userId: string) => {
  const task = await prisma.tasks.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    throw new TaskError('Task not found', 'TASK_NOT_FOUND');
  }

  if (task.userId !== userId) {
    throw new TaskError('Unauthorized', 'UNAUTHORIZED');
  }

  await prisma.tasks.delete({
    where: {
      id,
    },
  });
};
