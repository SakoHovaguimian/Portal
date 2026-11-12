import { z } from 'zod';

import { portalChatStrings as copy } from '@/strings';

import { ChatAttachmentMimeTypeSchema } from './chatAttachmentMimeType';

export { CHAT_ATTACHMENT_TYPES } from './chatAttachmentMimeType';

export const CHAT_ATTACHMENT_LIMIT = 5 * 1024 * 1024;

export const ChatAttachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  size: z.number(),
  mimeType: ChatAttachmentMimeTypeSchema,
});

export const ChatAttachmentInputSchema = ChatAttachmentSchema.omit({ id: true }).extend({
  name: z.string().trim().min(1).max(180),
  size: z.number().int().min(1).max(CHAT_ATTACHMENT_LIMIT, copy.validation.attachment),
  data: z.string().min(1).max(Math.ceil(CHAT_ATTACHMENT_LIMIT / 3) * 4),
}).strict();

export type ChatAttachment = z.infer<typeof ChatAttachmentSchema>;

export type ChatAttachmentInput = z.infer<typeof ChatAttachmentInputSchema>;
