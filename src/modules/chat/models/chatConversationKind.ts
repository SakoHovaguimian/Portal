import { z } from 'zod';

export const ChatConversationKindSchema = z.enum([
  'direct',
  'group',
]);

export type ChatConversationKind = z.infer<typeof ChatConversationKindSchema>;
