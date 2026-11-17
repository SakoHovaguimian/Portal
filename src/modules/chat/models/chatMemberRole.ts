import { z } from 'zod';

export const ChatMemberRoleSchema = z.enum([
  'owner',
  'admin',
  'member',
]);

export type ChatMemberRole = z.infer<typeof ChatMemberRoleSchema>;
