import { z } from 'zod';
export const SessionUserSchema = z.object({
  id: z.string().min(1),
  externalId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;
