import { z } from 'zod';

import { portalChatStrings as copy } from '@/strings';

export const ChatConversationUpdateSchema = z.object({
  name: z.string().trim().min(1, copy.validation.groupName).max(80, copy.validation.groupName).optional(),
  description: z.string().trim().max(400).optional(),
  muted: z.boolean().optional(),
  archived: z.boolean().optional(),
}).strict();

export type ChatConversationUpdate = z.infer<typeof ChatConversationUpdateSchema>;
