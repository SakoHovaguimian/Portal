import { z } from 'zod';

import { ChatMemberRoleSchema } from './chatMemberRole';
import { ChatPersonSchema } from './chatPerson';

export const ChatMemberSchema = ChatPersonSchema.extend({
  role: ChatMemberRoleSchema,
  lastReadAt: z.string().datetime().nullable(),
});

export type ChatMember = z.infer<typeof ChatMemberSchema>;
