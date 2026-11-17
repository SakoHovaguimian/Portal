import { z } from 'zod';

import { SessionUserSchema } from '@/models/sessionUser';
import { FirebaseAuthSessionSchema } from '@/services/auth/models/firebaseAuthSession';

export const ServerSessionSchema = z.object({
  auth: FirebaseAuthSessionSchema,
  user: SessionUserSchema,
  demo: z.boolean(),
  demoGeneration: z.string().optional(),
});

export type ServerSession = z.infer<typeof ServerSessionSchema>;
