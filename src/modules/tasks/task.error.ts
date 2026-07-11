export type TaskErrorCode = 'TASK_NOT_FOUND' | 'TASK_ALREADY_EXISTS' | 'UNAUTHORIZED';

const HTTP_STATUS_MAP: Record<TaskErrorCode, number> = {
  TASK_ALREADY_EXISTS: 409,
  TASK_NOT_FOUND: 404,
  UNAUTHORIZED: 401,
};

export class TaskError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    public readonly code: TaskErrorCode,
    statusCode?: number
  ) {
    super(message);
    this.name = 'TaskError';
    this.statusCode = statusCode ?? HTTP_STATUS_MAP[code] ?? 500;
  }

  toDto() {
    return {
      success: false as const,
      message: this.message,
      code: this.code,
    };
  }
}
