'use client';

import { useRef, useState } from 'react';

import {
  Button,
  DropZone,
  FileInput,
  ImageMosaic,
  UiIcon,
} from '@/components/ui';
import { strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.designSystem;

export function MediaShowcase() {

  const input = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const choose = (files: FileList | null) => {
    setFileNames(Array.from(files ?? []).map((file) => file.name));
  };

  function renderFileName(name: string, index: number) {

    return (
      <li key={`${index}:${name}`} className="wrap-anywhere">
        {name}
      </li>
    );

  }

  const selectedFiles = fileNames.map(renderFileName);

  function renderImagePreview() {

    return (
      <ImageMosaic
        label={copy.media}
        items={[
          {
            id: 'portal-preview',
            title: copy.imageTitle,
            alt: copy.imageAlt,
            src: '/portal-preview.svg',
            fallback: <UiIcon name="layers" />,
          },
        ]}
      />
    );

  }

  function renderFileSelection() {

    return (
      <DropZone onFiles={choose}>
        <FileInput
          ref={input}
          multiple
          aria-label={copy.upload}
          onChange={(event) => choose(event.target.files)}
        />
        <Button variant="secondary" onClick={() => input.current?.click()}>
          <UiIcon name="plus" />
          {copy.upload}
        </Button>
        <p className="m-0 text-sm text-tertiary">{copy.uploadHint}</p>
      </DropZone>
    );

  }

  function renderSelectedFiles() {

    return (
      fileNames.length > 0 && (
        <ul
          aria-live="polite"
          className="m-0 grid gap-2 text-sm text-secondary"
        >
          {selectedFiles}
        </ul>
      )
    );

  }

  return (
    <ShowcaseSection
      id="media"
      title={copy.media}
      description={copy.mediaHint}
      icon="box"
    >
      {renderImagePreview()}
      {renderFileSelection()}
      {renderSelectedFiles()}
    </ShowcaseSection>
  );

}
