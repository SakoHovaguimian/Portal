import { z } from 'zod';

import { ChatMemberRoleSchema } from './chatMemberRole';

export const ChatMemberUpdateSchema = z.object({
  userId: z.string().min(1),
  role: ChatMemberRoleSchema.exclude(['owner']).optional(),
}).strict();

export type ChatMemberUpdate = z.infer<typeof ChatMemberUpdateSchema>;
