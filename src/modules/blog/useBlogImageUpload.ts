'use client';
import { usePublicImageUpload } from '@/services/media/usePublicImageUpload';
import type { PublicImageUploadOptions } from '@/services/media/models/publicImageUploadOptions';

export function useBlogImageUpload(options: PublicImageUploadOptions) {
  return usePublicImageUpload(options);
}
