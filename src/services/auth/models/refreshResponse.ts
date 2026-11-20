import { z } from 'zod';

export const RefreshResponseSchema = z.object({
  id_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.coerce.number().int().positive(),
  user_id: z.string().min(1),
});
