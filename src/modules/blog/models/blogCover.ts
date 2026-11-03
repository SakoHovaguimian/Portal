import { z } from 'zod';
import { BlogImageUrlSchema } from './blogImageUrl';
import { BlogCoverPresetSchema } from './blogCoverPreset';

export { BlogCoverPresetSchema } from './blogCoverPreset';

export type { BlogCoverPreset } from './blogCoverPreset';

export const BlogCoverSchema = z.union([
  BlogCoverPresetSchema,
  BlogImageUrlSchema,
]);

export const StoredBlogCoverSchema = z.string().max(2000);

export type BlogCover = z.infer<typeof BlogCoverSchema>;

export function blogCoverSource(cover: string) {
  return cover === 'none' ? '' : cover;
}
