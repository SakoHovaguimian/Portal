import { z } from 'zod';

import { StoredBlogCategorySchema } from './blogCategory';
import { BlogCoverChoiceSchema } from './blogCoverChoice';

export const BlogOptionsSchema = z.object({
  categories: z.array(StoredBlogCategorySchema),
  covers: z.array(BlogCoverChoiceSchema),
});

export type BlogOptions = z.infer<typeof BlogOptionsSchema>;
