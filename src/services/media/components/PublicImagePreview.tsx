'use client';

import Image from 'next/image';
import { useState } from 'react';

import { UiIcon } from '@/components/ui';
import { portalMediaStrings as mediaCopy } from '@/strings';

import type { PublicImagePreviewProps } from '../models/publicImagePreviewProps';
import { isPublicImageReference } from '../models/publicImageUrl';

export function PublicImagePreview({ src }: PublicImagePreviewProps) {

  const [failed, setFailed] = useState<string>();
  return (
    <div className="relative aspect-video max-h-64 overflow-hidden rounded-xl border-control border-secondary bg-secondary_subtle">
      {failed === src || !isPublicImageReference(src) ? (
        <div
          role="status"
          className="flex h-full items-center justify-center gap-3 p-4 text-sm text-secondary"
        >
          <UiIcon name="image" className="size-5 shrink-0" />
          {mediaCopy.previewUnavailableHint}
        </div>
      ) : (
        <Image
          unoptimized
          fill
          src={src}
          alt={mediaCopy.imagePreviewAlt}
          sizes="(max-width: 640px) 90vw, 640px"
          className="object-contain"
          onError={() => setFailed(src)}
        />
      )}
    </div>
  );

}
