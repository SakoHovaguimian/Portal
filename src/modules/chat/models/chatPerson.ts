import { z } from 'zod';

export const ChatPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  team: z.string(),
});

export type ChatPerson = z.infer<typeof ChatPersonSchema>;
