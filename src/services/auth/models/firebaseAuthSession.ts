import { z } from 'zod';
export const FirebaseAuthSessionSchema = z.object({
  idToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.number(),
  externalId: z.string(),
  email: z.string().email(),
});
export type FirebaseAuthSession = z.infer<typeof FirebaseAuthSessionSchema>;
