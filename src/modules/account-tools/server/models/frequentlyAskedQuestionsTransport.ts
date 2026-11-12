import type { z } from 'zod';

import { FrequentlyAskedQuestionsSchema } from '../../models/frequentlyAskedQuestions';

export const FrequentlyAskedQuestionsTransportSchema = FrequentlyAskedQuestionsSchema.pick({
  sections: true,
});

export type FrequentlyAskedQuestionsTransport = z.infer<typeof FrequentlyAskedQuestionsTransportSchema>;
