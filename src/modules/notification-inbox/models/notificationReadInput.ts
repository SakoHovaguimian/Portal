import { z } from 'zod';

export const NotificationReadInputSchema = z
  .object({ read: z.boolean() })
  .strict();

export type NotificationReadInput = z.infer<typeof NotificationReadInputSchema>;
