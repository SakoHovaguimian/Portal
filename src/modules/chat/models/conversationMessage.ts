import { z } from 'zod';
import { ChatReactionSchema } from './chatReaction';
import { portalChatStrings as copy } from '@/strings';
import { ChatAttachmentSchema, ChatAttachmentInputSchema } from './chatAttachment';

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

export const ConversationMessageInputSchema = z.object({
  body: z.string().trim().max(4000, copy.validation.message),
  replyToId: z.string().uuid().nullable().default(null),
  attachments: z.array(ChatAttachmentInputSchema).max(4, copy.validation.attachment).default([]),
  clientId: z.string().uuid(),
}).strict().refine((value) => value.body.length > 0 || value.attachments.length > 0, { message: copy.validation.message });

export const ConversationMessageUpdateSchema = z.object({ body: z.string().trim().min(1, copy.validation.message).max(4000, copy.validation.message) }).strict();

export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

export type ConversationMessageInput = z.infer<typeof ConversationMessageInputSchema>;
