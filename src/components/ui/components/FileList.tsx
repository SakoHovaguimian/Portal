'use client';

import { useEffect, useState } from 'react';

import type { FileListProps } from '../models/fileListProps';
import type { FilePreviewProps } from '../models/filePreviewProps';
import { componentExpansionStrings as copy } from '@/strings';

import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { RecordThumbnail } from './RecordThumbnail';
import { UiIcon } from './UiIcon';

function FilePreview({ item }: FilePreviewProps) {

  const [url, setUrl] = useState<string>();
  useEffect(() => {

    if (
      !item.file?.type.startsWith('image/') ||
      item.file.size > 10 * 1024 * 1024
    ) { return; }
    const reader = new FileReader();
    reader.onload = () =>
      setUrl(typeof reader.result === 'string' ? reader.result : undefined);
    reader.readAsDataURL(item.file);
    const cleanup = () => {

      reader.onload = null;
      if (reader.readyState === FileReader.LOADING) { reader.abort(); }

    };

    return cleanup;

  }, [item.file]);
  const src = item.previewUrl ?? url;
  return src ? (
    <RecordThumbnail src={src} alt={item.name} />
  ) : (
    <UiIcon name="file" className="size-6 shrink-0 text-tertiary" />
  );

}

export function FileList({
  files,
  label = copy.upload.fileList,
  disabled,
  onRemove,
  onRetry,
  onCancel,
}: FileListProps) {

  function renderFile(item: (typeof files)[number]) {

    return (
      <li
        key={item.id}
        className="grid min-w-0 gap-3 rounded-control border-control border-secondary bg-primary p-3"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <FilePreview key={item.id} item={item} />
          <div className="min-w-0 flex-1 basis-36">
            <p className="m-0 text-sm font-medium wrap-anywhere text-primary">
              {item.name}
            </p>
            <p className="m-0 mt-1 text-xs text-tertiary">
              {copy.upload.fileSize(item.size)}
            </p>
            <p role="status" className="m-0 mt-1 text-xs text-secondary">
              {copy.upload.statuses[item.status]}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.status === 'uploading' && onCancel && (
              <Button
                variant="ghost"
                disabled={disabled}
                aria-label={copy.upload.cancelFile(item.name)}
                onClick={() => onCancel(item.id)}
              >
                {copy.upload.cancel}
              </Button>
            )}
            {(item.status === 'error' || item.status === 'cancelled') &&
                onRetry && (
              <Button
                variant="secondary"
                disabled={disabled}
                aria-label={copy.upload.retryFile(item.name)}
                onClick={() => onRetry(item.id)}
              >
                {copy.upload.retry}
              </Button>
            )}
            {item.status !== 'uploading' && onRemove && (
              <Button
                variant="ghost"
                disabled={disabled}
                aria-label={copy.upload.removeFile(item.name)}
                onClick={() => onRemove(item.id)}
              >
                {copy.upload.remove}
              </Button>
            )}
          </div>
        </div>
        {item.status === 'uploading' && (
          <ProgressBar
            label={copy.upload.progress(item.name)}
            value={item.progress}
            indeterminate={item.progress === undefined}
            size="sm"
          />
        )}
        {item.status === 'error' && (
          <p role="alert" className="m-0 text-xs text-error-primary">
            {item.error ?? copy.upload.failedHint}
          </p>
        )}
      </li>
    );

  }

  const fileItems = files.map(renderFile);

  return (
    <ul aria-label={label} className="m-0 grid list-none gap-3 p-0">
      {fileItems}
    </ul>
  );

}
