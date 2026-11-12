import { z } from 'zod';

export const ChatReactionEmojiSchema = z.enum([
  '👍',
  '🎉',
  '❤️',
]);

export type ChatReactionEmoji = z.infer<typeof ChatReactionEmojiSchema>;
