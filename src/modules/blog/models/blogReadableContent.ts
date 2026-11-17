import { z } from 'zod';

import { BlogReadableBulletContentSchema } from './blogBulletContent';
import { BlogReadableCalloutContentSchema } from './blogCalloutContent';
import { BlogReadableDividerContentSchema } from './blogDividerContent';
import { BlogReadableEmbedContentSchema } from './blogEmbedContent';
import { BlogReadableFooterContentSchema } from './blogFooterContent';
import { BlogReadableGalleryFourContentSchema } from './blogGalleryFourContent';
import { BlogReadableGalleryThreeContentSchema } from './blogGalleryThreeContent';
import { BlogReadableGalleryTwoContentSchema } from './blogGalleryTwoContent';
import { BlogReadableHeaderContentSchema } from './blogHeaderContent';
import { BlogReadableImageContentSchema } from './blogImageContent';
import { BlogReadableLinkContentSchema } from './blogLinkContent';
import { BlogReadableQuoteContentSchema } from './blogQuoteContent';
import { BlogReadableSectionContentSchema } from './blogSectionContent';

// Display projections never replace the stored metadata or validate a write.
export const BlogReadableContentSchema = z.discriminatedUnion('contentType', [
  BlogReadableHeaderContentSchema,
  BlogReadableSectionContentSchema,
  BlogReadableFooterContentSchema,
  BlogReadableQuoteContentSchema,
  BlogReadableBulletContentSchema,
  BlogReadableDividerContentSchema,
  BlogReadableEmbedContentSchema,
  BlogReadableImageContentSchema,
  BlogReadableGalleryTwoContentSchema,
  BlogReadableGalleryThreeContentSchema,
  BlogReadableGalleryFourContentSchema,
  BlogReadableCalloutContentSchema,
  BlogReadableLinkContentSchema,
]);

export type BlogReadableContent = z.infer<typeof BlogReadableContentSchema>;
