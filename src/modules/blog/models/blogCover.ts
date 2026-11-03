import { z } from 'zod';
import { BlogImageUrlSchema } from './blogContentUrl';
export const BlogCoverPresetSchema = z.enum(['none']);
export const BlogCoverSchema = z.union([
  BlogCoverPresetSchema,
  BlogImageUrlSchema,
]);
export const StoredBlogCoverSchema = z.string().max(2000);
export type BlogCover = z.infer<typeof BlogCoverSchema>;
export function blogCoverSource(cover: string) {
  return cover === 'none' ? '' : cover;
}
