import { z } from 'zod';

import { portalChatStrings as copy } from '@/strings';

import { ChatAttachmentInputSchema } from './chatAttachment';

export const ConversationMessageInputSchema = z.object({
  body: z.string().trim().max(4000, copy.validation.message),
  replyToId: z.string().uuid().nullable().default(null),
  attachments: z.array(ChatAttachmentInputSchema).max(4, copy.validation.attachment).default([]),
  clientId: z.string().uuid(),
}).strict().refine((value) => value.body.length > 0 || value.attachments.length > 0, { message: copy.validation.message });

export type ConversationMessageInput = z.infer<typeof ConversationMessageInputSchema>;
