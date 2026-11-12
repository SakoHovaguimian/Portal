'use client';

import type { PublicImageUploadOptions } from '@/services/media/models/publicImageUploadOptions';
import { usePublicImageUpload } from '@/services/media/usePublicImageUpload';

export function useBlogImageUpload(options: PublicImageUploadOptions) {
  return usePublicImageUpload(options);
}
