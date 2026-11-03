import { z } from 'zod';
import { FrequentlyAskedQuestionSectionSchema } from './frequentlyAskedQuestionSection';

export {
  FrequentlyAskedQuestionSectionSchema,
} from './frequentlyAskedQuestionSection';

export type {
  FrequentlyAskedQuestionSection,
} from './frequentlyAskedQuestionSection';

export const FrequentlyAskedQuestionsSchema = z.object({
  illustrative: z.boolean(),
  sections: z.array(FrequentlyAskedQuestionSectionSchema),
});
