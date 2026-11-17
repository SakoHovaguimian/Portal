'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { RecordThumbnailProps } from '../models/recordThumbnailProps';
import { strings } from '@/strings';

import { UiIcon } from './UiIcon';

export function RecordThumbnail({
  src,
  alt,
  loading = false,
  hasImage = true,
  emptyLabel = strings.media.emptyHint,
}: RecordThumbnailProps) {

  const [failed, setFailed] = useState<string>();
  return (
    <span
      className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-control border-control border-secondary bg-secondary_subtle text-tertiary"
      aria-busy={loading}
    >
      {src && failed !== src ? (
        <Image
          unoptimized
          fill
          sizes="64px"
          src={src}
          alt={alt}
          className="object-cover"
          onError={() => setFailed(src)}
        />
      ) : (
        <>
          <UiIcon name="leaf" className="size-6" />
          <span className="sr-only">
            {loading
              ? strings.apiMutations.mediaLoading
              : hasImage
                ? strings.media.previewUnavailableHint
                : emptyLabel}
          </span>
        </>
      )}
    </span>
  );

}
