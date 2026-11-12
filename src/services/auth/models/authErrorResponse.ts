import { z } from 'zod';

export const AuthErrorResponseSchema = z.object({
  error: z.object({ message: z.string() }),
});

export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
