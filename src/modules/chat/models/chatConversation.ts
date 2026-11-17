import { z } from 'zod';

import { ChatConversationKindSchema } from './chatConversationKind';
import { ChatMemberSchema } from './chatMember';
import { ConversationMessageSchema } from './conversationMessage';

export const ChatConversationSchema = z.object({
  id: z.string().uuid(),
  kind: ChatConversationKindSchema,
  name: z.string(),
  description: z.string(),
  members: z.array(ChatMemberSchema),
  updatedAt: z.string().datetime(),
  lastMessage: ConversationMessageSchema.nullable(),
  unreadCount: z.number().int(),
  muted: z.boolean(),
  archived: z.boolean(),
});

export type ChatConversation = z.infer<typeof ChatConversationSchema>;

export { ChatConversationInputSchema, type ChatConversationInput } from './chatConversationInput';

export { ChatConversationUpdateSchema, type ChatConversationUpdate } from './chatConversationUpdate';
