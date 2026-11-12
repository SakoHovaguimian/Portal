import { z } from 'zod';

export const EngagementKeySchema = z
  .object({
    type: z.string().regex(/^[a-z][a-z0-9-]{0,39}$/),
    id: z.string().min(1).max(160),
  })
  .strict();

export type EngagementKey = z.infer<typeof EngagementKeySchema>;
