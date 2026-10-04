import { z } from 'zod';
export const RefreshResponseSchema = z.object({
  id_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.coerce.number(),
  user_id: z.string(),
});
