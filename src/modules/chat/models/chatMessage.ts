import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  author: z.string(),
  message: z.string(),
  createdAt: z.string().datetime(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export { ChatMessageInputSchema } from './chatMessageInput';
