import { z } from 'zod';

export const CHAT_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
  'audio/mpeg',
  'video/mp4',
  'video/webm',
] as const;

export const ChatAttachmentMimeTypeSchema = z.enum(CHAT_ATTACHMENT_TYPES);

export type ChatAttachmentMimeType = z.infer<typeof ChatAttachmentMimeTypeSchema>;
