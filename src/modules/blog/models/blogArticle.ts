import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogCategorySchema, StoredBlogCategorySchema } from './blogCategory';
import { BlogContentsSchema } from './blogContent';
import { BlogCoverSchema, StoredBlogCoverSchema } from './blogCover';
import { BlogStatusSchema } from './blogStatus';
import { StoredBlogContentsSchema } from './storedBlogContent';

export { BlogRevisionInputSchema } from './blogRevisionInput';

const copy = portalPublishingStrings.article;
const builderCopy = portalPublishingStrings.builder;

const BlogArticleFieldsSchema = z.object({
  id: z.string().uuid(),
  slug: z
    .string()
    .trim()
    .min(3, copy.invalidSlugHint)
    .max(100, copy.invalidSlugHint)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, copy.invalidSlugHint),
  title: z.string().min(1, copy.invalidTitleHint).max(500, copy.invalidTitleHint),
  description: z
    .string()
    .min(1, copy.invalidDescription)
    .max(20000, copy.invalidDescription),
  author: z.string().min(1, copy.invalidAuthorHint).max(500, copy.invalidAuthorHint),
  content: StoredBlogContentsSchema.default([]),
  // Older deployed responses may still include writing awaiting migration.
  body: z.string().max(50000, copy.invalidBody).optional(),
  category: StoredBlogCategorySchema,
  cover: StoredBlogCoverSchema,
  status: BlogStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
  revision: z.number().int().min(1),
});
export const BlogArticleSchema = BlogArticleFieldsSchema;

export const BlogMutationInputSchema = BlogArticleFieldsSchema.pick({
  slug: true,
  title: true,
  description: true,
  author: true,
  category: true,
  cover: true,
})
  .extend({
    category: BlogCategorySchema,
    cover: BlogCoverSchema,
    author: z
      .string()
      .trim()
      .min(2, copy.invalidAuthorHint)
      .max(100, copy.invalidAuthorHint),
    title: z
      .string()
      .trim()
      .min(3, copy.invalidTitleHint)
      .max(140, copy.invalidTitleHint),
    description: z
      .string()
      .trim()
      .min(20, copy.invalidDescription)
      .max(350, copy.invalidDescription),
    content: BlogContentsSchema,
    revision: z.number().int().min(1).optional(),
  })
  .strict()
  .refine((article) => article.content.length > 0, {
    message: builderCopy.invalidContentHint,
    path: ['content'],
  });

export type BlogArticle = z.infer<typeof BlogArticleSchema>;

export type BlogMutationInput = z.infer<typeof BlogMutationInputSchema>;

export type BlogArticleDraft = Pick<
  BlogArticle,
  | 'slug'
  | 'title'
  | 'description'
  | 'author'
  | 'content'
  | 'category'
  | 'cover'
  | 'body'
> & { revision?: number };
