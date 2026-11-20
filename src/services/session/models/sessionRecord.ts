import { z } from 'zod';

export const SessionRecordSchema = z.object({
  expiresAt: z.number().int(),
  payload: z.string(),
});

export type SessionRecord = z.infer<typeof SessionRecordSchema>;
