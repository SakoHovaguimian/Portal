import { z } from 'zod';
import { SessionUserSchema } from './sessionUser';
// Public session projection: never add auth tokens here.
export const AppSessionSchema = z.object({
  user: SessionUserSchema,
  expiresAt: z.string().datetime(),
});
export type AppSession = z.infer<typeof AppSessionSchema>;
