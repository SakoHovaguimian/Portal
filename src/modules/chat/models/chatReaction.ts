import { z } from 'zod';

export const ChatReactionEmojiSchema = z.enum([
  '👍',
  '🎉',
  '❤️',
]);

export const ChatReactionSchema = z.object({
  emoji: ChatReactionEmojiSchema,
  userIds: z.array(z.string()),
});

export const ChatReactionInputSchema = ChatReactionSchema.pick({ emoji: true }).strict();

export type ChatReactionEmoji = z.infer<typeof ChatReactionEmojiSchema>;

export type ChatReaction = z.infer<typeof ChatReactionSchema>;
