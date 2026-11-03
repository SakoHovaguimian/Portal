import { z } from 'zod';
import { portalMediaStrings as mediaCopy } from '@/strings';
import { isPublicImageReference } from '@/services/media/models/publicImageUrl';
export const publicImageMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;
export const publicImageMaxBytes = 5 * 1024 * 1024;
export const PublicImageSchema = z.object({
  fileName: z.string().min(1),
  thumbnailFileName: z.string().nullable().optional(),
  visibility: z.literal('public'),
  url: z
    .string()
    .max(2000)
    .refine(isPublicImageReference, mediaCopy.imageUrlError),
  thumbnailUrl: z
    .string()
    .refine(isPublicImageReference, mediaCopy.imageUrlError)
    .nullable()
    .optional(),
});
export type PublicImage = z.infer<typeof PublicImageSchema>;
