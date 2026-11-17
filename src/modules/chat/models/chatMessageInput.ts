import { z } from 'zod';

import { strings } from '@/strings';

export const ChatMessageInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, strings.errors.invalidInput)
    .max(2000, strings.errors.invalidInput),
});

export type ChatMessageInput = z.infer<typeof ChatMessageInputSchema>;
