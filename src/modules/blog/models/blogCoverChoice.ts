import { z } from 'zod';

import { StoredBlogCoverSchema } from './blogCover';

export const BlogCoverChoiceSchema = z.object({
  value: StoredBlogCoverSchema,
  title: z.string().max(500),
});

export type BlogCoverChoice = z.infer<typeof BlogCoverChoiceSchema>;
