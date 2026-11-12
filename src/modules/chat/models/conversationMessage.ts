import { z } from 'zod';

import { ChatAttachmentSchema } from './chatAttachment';
import { ChatReactionSchema } from './chatReaction';

export const ConversationMessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  clientId: z.string().uuid().nullable().default(null),
  authorId: z.string(),
  author: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  editedAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
  replyToId: z.string().uuid().nullable(),
  attachments: z.array(ChatAttachmentSchema),
  pinned: z.boolean(),
  reactions: z.array(ChatReactionSchema),
});

export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

export { ConversationMessageInputSchema, type ConversationMessageInput } from './conversationMessageInput';

export { ConversationMessageUpdateSchema } from './conversationMessageUpdate';
