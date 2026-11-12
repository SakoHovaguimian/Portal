import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogBulletContentSchema } from './blogBulletContent';
import { BlogCalloutContentSchema } from './blogCalloutContent';
import { BlogDividerContentSchema } from './blogDividerContent';
import { BlogEmbedContentSchema } from './blogEmbedContent';
import { BlogFooterContentSchema } from './blogFooterContent';
import { BlogGalleryFourContentSchema } from './blogGalleryFourContent';
import { BlogGalleryThreeContentSchema } from './blogGalleryThreeContent';
import { BlogGalleryTwoContentSchema } from './blogGalleryTwoContent';
import { BlogHeaderContentSchema } from './blogHeaderContent';
import { BlogImageContentSchema } from './blogImageContent';
import { BlogLinkContentSchema } from './blogLinkContent';
import { BlogQuoteContentSchema } from './blogQuoteContent';
import { BlogSectionContentSchema } from './blogSectionContent';

const copy = portalPublishingStrings.builder;

export const BlogContentSchema = z.discriminatedUnion('contentType', [
  BlogHeaderContentSchema,
  BlogSectionContentSchema,
  BlogFooterContentSchema,
  BlogQuoteContentSchema,
  BlogBulletContentSchema,
  BlogDividerContentSchema,
  BlogEmbedContentSchema,
  BlogImageContentSchema,
  BlogGalleryTwoContentSchema,
  BlogGalleryThreeContentSchema,
  BlogGalleryFourContentSchema,
  BlogCalloutContentSchema,
  BlogLinkContentSchema,
]);

export type BlogContent = z.infer<typeof BlogContentSchema>;

export const BlogContentsSchema = z
  .array(BlogContentSchema)
  .max(100, copy.tooManyBlocks)
  .superRefine((items, context) => {

    if (new Set(items.map((item) => item.id)).size !== items.length) { context.addIssue({ code: 'custom', message: copy.duplicateBlocks }); }
    if (new TextEncoder().encode(JSON.stringify(items)).length > 250000) { context.addIssue({ code: 'custom', message: copy.invalidContentSize }); }

  });
