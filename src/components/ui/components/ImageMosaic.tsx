'use client';

import type { MosaicTileProps } from '../models/mosaicTileProps';
import type { ImageMosaicProps } from '../models/imageMosaicProps';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { strings } from '@/strings';
import type { ImageMosaicItem } from '../models/imageMosaicItem';
import { cn } from '../lib/cn';
import { ImagePreview } from './ImagePreview';
import { UiIcon } from './UiIcon';

function MosaicTile({
  item,
  featured,
  paired,
  disabled,
  onPreview,
}: MosaicTileProps) {

  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <li
      className={cn(
        'grid min-w-0',
        featured && 'col-span-2',
        (featured || paired) && 'row-span-2',
      )}
    >
      <button
        type="button"
        className="ui-image-mosaic-tile group relative block w-full cursor-pointer overflow-hidden rounded-card border-control border-secondary bg-secondary_subtle outline-none transition duration-(--motion-duration-base) hover:border-brand hover:shadow-(--shadow-overlay) focus-visible:ring-4 focus-visible:ring-brand active:scale-(--motion-button-press-scale) disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        disabled={disabled}
        aria-label={strings.mediaEditor.preview(item.title)}
        onClick={onPreview}
      >
        {item.src && failedSrc !== item.src ? (
          <Image
            unoptimized
            fill
            src={item.src}
            alt={item.alt}
            sizes="(max-width: 768px) 66vw, 40vw"
            onError={() => setFailedSrc(item.src)}
            className="object-cover transition-transform duration-(--motion-duration-enter) motion-safe:group-hover:scale-(--motion-hover-scale) motion-safe:group-focus-visible:scale-(--motion-hover-scale)"
          />
        ) : (
          <span className="grid h-full place-content-center text-tertiary">
            <UiIcon name="file" className="size-8" />
          </span>
        )}
      </button>
    </li>
  );

}

export function ImageMosaic<T extends ImageMosaicItem>({
  items,
  label,
  disabled,
  renderDetails,
  renderActions,
}: ImageMosaicProps<T>) {

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selected = items[selectedIndex];

  function renderMosaicTile(item: T, index: number) {

    return (
      <MosaicTile
        key={item.id}
        item={item}
        featured={index % 7 === 0}
        paired={items.length === 2}
        disabled={disabled}
        onPreview={() => {

          setSelectedId(item.id);
          setPreviewOpen(true);

        }}
      />
    );

  }

  const mosaicTiles = items.map(renderMosaicTile);

  return (
    <div className="@container min-w-0">
      <ol
        ref={list}
        tabIndex={-1}
        aria-label={label}
        className={cn(
          'ui-image-mosaic m-0 grid list-none grid-cols-3 gap-2 p-0 outline-none focus-visible:ring-4 focus-visible:ring-brand @xl:grid-cols-4 @3xl:grid-cols-5 @3xl:gap-3',
          items.length === 1 && 'grid-cols-2 @xl:grid-cols-2 @3xl:grid-cols-2',
          items.length === 2 && 'grid-cols-3 @xl:grid-cols-3 @3xl:grid-cols-3',
        )}
      >
        {mosaicTiles}
      </ol>
      <ImagePreview
        image={selected ?? null}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fallbackFocus={list}
        details={
          selected ? renderDetails?.(selected, selectedIndex) : undefined
        }
        actions={
          selected ? renderActions?.(selected, selectedIndex) : undefined
        }
      />
    </div>
  );

}
