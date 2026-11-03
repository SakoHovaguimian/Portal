import { portalPublishingStrings } from '@/strings';
import { z } from 'zod';
import { StoredBlogMetadataSchema } from './storedBlogMetadata';

const copy = portalPublishingStrings.builder;

export const StoredBlogContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.string().min(1).max(100),
    metaData: StoredBlogMetadataSchema,
  })
  .passthrough()
  .superRefine((block, context) => {

    const additional = Object.fromEntries(
      Object.entries(block).filter(
        ([key]) => !['id', 'contentType', 'metaData'].includes(key),
      ),
    );
    if (!StoredBlogMetadataSchema.safeParse(additional).success) { context.addIssue({ code: 'custom', message: copy.invalidStoredContent }); }
    if (new TextEncoder().encode(JSON.stringify(block)).length > 250000) { context.addIssue({ code: 'custom', message: copy.invalidContentSize }); }

  });

export type StoredBlogContent = z.infer<typeof StoredBlogContentSchema>;

export const StoredBlogContentsSchema = z
  .array(StoredBlogContentSchema)
  .max(100, copy.tooManyBlocks);
