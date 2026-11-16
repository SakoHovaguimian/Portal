import Image from 'next/image';

import type { MediaCardItem } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

const copy = strings.gallery;
type GalleryImage = keyof typeof copy;

const shots: readonly GalleryImage[] = ['alpine', 'ridge', 'forest', 'cloud', 'valley'];

export const galleryCards: readonly MediaCardItem[] = shots.map((image) => ({
  id: image,
  label: copy[image],
  content: (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        fill
        unoptimized
        draggable={false}
        sizes="(max-width: 640px) 45vw, 240px"
        src={`/component-library/${image}.webp`}
        alt={copy[image]}
        className="pointer-events-none object-cover"
      />
      <span className="absolute inset-x-2 bottom-2 w-fit max-w-[calc(100%-1rem)] rounded-control bg-primary px-2.5 py-1 text-xs font-medium text-primary">
        {copy[image]}
      </span>
    </div>
  ),
}));
