import { z } from 'zod';

export const ChatEmptyMutationInputSchema = z.object({}).strict();

export type ChatEmptyMutationInput = z.infer<typeof ChatEmptyMutationInputSchema>;
