import * as z from 'zod';

// export const TaskRequestSchema = z.object({
//   taskId: z.uuid(),
// });

// export type TaskRequestDto = z.infer<typeof TaskRequestSchema>;

export const GetTaskParamsSchema = z.object({
  taskId: z.uuid(),
});

export type GetTaskParamsDto = z.infer<typeof GetTaskParamsSchema>;

// INFO: GET Task Schema and Type
export const TaskResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().default(''),
  description: z.string().default(''),
});

export type TaskResponseDto = z.infer<typeof TaskResponseSchema>;

export const GetTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    task: TaskResponseSchema,
  }),
});

export type GetTaskResponseDto = z.infer<typeof GetTaskResponseSchema>;

export function toTaskDto(task: {
  id: string;
  title: string;
  description: string | undefined;
}): TaskResponseDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
  };
}

// INFO: GET ALL Task Schema and Type
export const GetAllTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: {
    tasks: z.array(TaskResponseSchema),
  },
});

export type GetAllTaskResponseDto = z.infer<typeof GetAllTaskResponseSchema>;

export function toGetAllTaskDto(
  tasks: Array<{
    id: string;
    title: string;
    description: string | undefined
  }>
): GetAllTaskResponseDto {
  return {
    success: true,
    message: 'Tasks retrieved successfully',
    data: {
      tasks: tasks.map(toTaskDto)
    },
  };
}

// INFO: CREATE Task Schema and Type
export const CreateTaskRequestSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500).optional(),
});

export type CreateTaskRequestDto = z.infer<typeof CreateTaskRequestSchema>;

export const CreateTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    task: TaskResponseSchema,
  }),
});

export type CreateTaskResponseDto = z.infer<typeof CreateTaskResponseSchema>;

export function toCreateTaskDto(task: {
  id: string;
  title: string;
  description: string | undefined;
}): CreateTaskResponseDto {
  return {
    success: true,
    message: 'Task created successfully',
    data: {
      task: toTaskDto(task),
    },
  };
}

// INFO: UPDATE Task Schema and Type
export const UpdateTaskRequestSchema = z.object({
  id: z.uuid(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

export type UpdateTaskRequestDto = z.infer<typeof UpdateTaskRequestSchema>;

export const UpdateTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    task: TaskResponseSchema,
  }),
});

export type UpdateTaskResponseDto = z.infer<typeof UpdateTaskResponseSchema>;

export function toUpdateTaskDto(task: {
  id: string;
  title: string;
  description: string | undefined;
}): UpdateTaskResponseDto {
  return {
    success: true,
    message: 'Task Updated Successfully',
    data: {
      task: toTaskDto(task),
    },
  };
}

// INFO: DELETE Task Schema and Type
export const DeleteTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type DeleteTaskResponseDto = z.infer<typeof DeleteTaskResponseSchema>;

export function toDeleteTaskDto(): DeleteTaskResponseDto {
  return {
    success: true,
    message: 'Task Deleted Successfully',
  };
}
