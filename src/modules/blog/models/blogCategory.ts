import { portalPublishingStrings } from '@/strings';
import { z } from 'zod';

const copy = portalPublishingStrings.article;

export const blogCategoryPresets = [
  'ideas',
  'community',
  'guides',
  'stories',
] as const;

export const BlogCategorySchema = z
  .string()
  .trim()
  .min(2, copy.invalidTopic)
  .max(80, copy.invalidTopic);

export const StoredBlogCategorySchema = z.string().min(1).max(200);

export type BlogCategory = z.infer<typeof BlogCategorySchema>;

export function blogCategoryLabel(category: string) {

  return Object.hasOwn(copy.categories, category)
    ? copy.categories[category as keyof typeof copy.categories]
    : category;

}
