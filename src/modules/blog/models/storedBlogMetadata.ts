import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

function isStoredValue(value: unknown, depth = 0): boolean {

  if (depth > 5) { return false; }
  if (value === null || typeof value === 'boolean') { return true; }
  if (typeof value === 'string') { return value.length <= 50000; }
  if (typeof value === 'number') { return Number.isFinite(value); }
  if (Array.isArray(value)) {

    if (value.length > 25000) { return false; }
    const allItemsAreStored = value.every((item) => {

      const itemIsStored = isStoredValue(item, depth + 1);
      return itemIsStored;

    });

    return allItemsAreStored;

  }
  if (
    !value ||
    typeof value !== 'object' ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    return false;
  }
  const entries = Object.entries(value);
  if (entries.length > 100) { return false; }
  const allEntriesAreStored = entries.every(([key, item]) => {

    const entryIsStored =
      key.length > 0 && key.length <= 100 && isStoredValue(item, depth + 1);
    return entryIsStored;

  });

  return allEntriesAreStored;

}

export const StoredBlogMetadataSchema = z
  .record(z.string(), z.unknown())
  .superRefine((value, context) => {

    if (!isStoredValue(value)) {

      context.addIssue({ code: 'custom', message: copy.invalidStoredContentHint });
      return;

    }
    if (new TextEncoder().encode(JSON.stringify(value)).length > 250000) {
      context.addIssue({ code: 'custom', message: copy.invalidContentSizeHint });
    }

  });

export type StoredBlogMetadata = z.infer<typeof StoredBlogMetadataSchema>;
