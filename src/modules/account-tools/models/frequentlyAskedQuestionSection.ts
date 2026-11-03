import { z } from 'zod';

export const FrequentlyAskedQuestionSectionSchema = z.object({
  title: z.string(),
  sections: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export type FrequentlyAskedQuestionSection = z.infer<
  typeof FrequentlyAskedQuestionSectionSchema
>;
