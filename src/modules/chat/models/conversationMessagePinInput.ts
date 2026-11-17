import { z } from 'zod';

export const ConversationMessagePinInputSchema = z.object({ pinned: z.boolean() }).strict();

export type ConversationMessagePinInput = z.infer<typeof ConversationMessagePinInputSchema>;
