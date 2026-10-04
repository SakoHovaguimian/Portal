import { z } from 'zod';
export const AuthResponseSchema = z.object({
  idToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.coerce.number(),
  localId: z.string(),
  email: z.string().email(),
});
