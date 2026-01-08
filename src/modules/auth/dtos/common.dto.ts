import * as z from 'zod';

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string(),
});

export type ErrorResponseDto = z.infer<typeof ErrorResponseSchema>;

export function toErrorResponse(
  message: string,
  code: string,
): ErrorResponseDto {
  return {
    success: false,
    message,
    code,
  }
}


export const IdParamsSchema = z.object({
  id: z.uuid({error: 'Invalid Id Format'})
})

export type IdParamsDto = z.infer<typeof IdParamsSchema>;

