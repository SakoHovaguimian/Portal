import { z } from 'zod';

import { ChatReactionEmojiSchema } from './chatReactionEmoji';

export { ChatReactionEmojiSchema, type ChatReactionEmoji } from './chatReactionEmoji';

export const ChatReactionSchema = z.object({
  emoji: ChatReactionEmojiSchema,
  userIds: z.array(z.string()),
});

export const ChatReactionInputSchema = ChatReactionSchema.pick({ emoji: true }).strict();

export type ChatReaction = z.infer<typeof ChatReactionSchema>;
