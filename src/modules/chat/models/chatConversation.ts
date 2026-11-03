import { z } from 'zod';
import { portalChatStrings as copy } from '@/strings';
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

export const ChatConversationInputSchema = z.object({
  kind: ChatConversationKindSchema,
  name: z.string().trim().max(80, copy.validation.groupName),
  description: z.string().trim().max(400),
  memberIds: z.array(z.string().min(1)).min(1, copy.validation.people).max(19, copy.validation.people),
}).strict().superRefine((input, context) => {

  if (input.kind === 'direct' && input.memberIds.length !== 1) {

    context.addIssue({
      code: 'custom',
      message: copy.validation.people,
    });

  }
  if (input.kind === 'group' && !input.name) {

    context.addIssue({
      code: 'custom',
      message: copy.validation.groupName,
    });

  }

});

export const ChatConversationUpdateSchema = z.object({
  name: z.string().trim().min(1, copy.validation.groupName).max(80, copy.validation.groupName).optional(),
  description: z.string().trim().max(400).optional(),
  muted: z.boolean().optional(),
  archived: z.boolean().optional(),
}).strict();

export type ChatConversation = z.infer<typeof ChatConversationSchema>;

export type ChatConversationInput = z.infer<typeof ChatConversationInputSchema>;

export type ChatConversationUpdate = z.infer<typeof ChatConversationUpdateSchema>;
