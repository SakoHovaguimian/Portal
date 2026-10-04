import { z } from 'zod';
import { FirebaseAuthSessionSchema } from '@/services/auth/models/firebaseAuthSession';
import { SessionUserSchema } from '@/models/sessionUser';
export const ServerSessionSchema = z.object({
  auth: FirebaseAuthSessionSchema,
  user: SessionUserSchema,
  demo: z.boolean(),
});
export type ServerSession = z.infer<typeof ServerSessionSchema>;
