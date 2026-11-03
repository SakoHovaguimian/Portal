import { z } from 'zod';
import { portalChatStrings as copy } from '@/strings';

export const CHAT_ATTACHMENT_LIMIT = 5 * 1024 * 1024;

export const CHAT_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain', 'audio/mpeg', 'video/mp4', 'video/webm'] as const;

export const ChatAttachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  size: z.number(),
  mimeType: z.enum(CHAT_ATTACHMENT_TYPES),
});

export const ChatAttachmentInputSchema = ChatAttachmentSchema.omit({ id: true }).extend({
  name: z.string().trim().min(1).max(180),
  size: z.number().int().min(1).max(CHAT_ATTACHMENT_LIMIT, copy.validation.attachment),
  data: z.string().min(1).max(Math.ceil(CHAT_ATTACHMENT_LIMIT / 3) * 4),
}).strict();

export type ChatAttachment = z.infer<typeof ChatAttachmentSchema>;

export type ChatAttachmentInput = z.infer<typeof ChatAttachmentInputSchema>;
