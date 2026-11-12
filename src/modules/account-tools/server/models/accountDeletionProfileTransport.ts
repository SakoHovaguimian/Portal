import { z } from 'zod';

export const AccountDeletionProfileTransportSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
});

export type AccountDeletionProfileTransport = z.infer<typeof AccountDeletionProfileTransportSchema>;
