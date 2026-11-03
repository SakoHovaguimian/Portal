'use client';

import { useId, useRef, useState } from 'react';
import { componentExpansionStrings as copy } from '@/strings';
import type { UploadFieldProps } from '../models/uploadFieldProps';
import type { FileRejection } from '../models/fileRejection';
import { validateUploadFiles } from '../lib/validateUploadFiles';
import { Button } from './Button';
import { DropZone } from './DropZone';
import { FileInput } from './FileInput';
import { FileList } from './FileList';
import { UiIcon } from './UiIcon';

export function UploadField({
  label,
  description,
  files,
  accept,
  multiple = true,
  maxFiles,
  maxSizeBytes,
  required,
  invalid,
  disabled,
  onFiles,
  onReject,
  ...listProps
}: UploadFieldProps) {

  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const limit = Math.max(0, Math.floor(multiple ? (maxFiles ?? Infinity) : 1));
  const full = files.length >= limit;
  const receive = (list: FileList | null) => {

    if (disabled) { return; }
    const result = validateUploadFiles(
      Array.from(list ?? []),
      accept,
      maxSizeBytes,
      Math.max(0, limit - files.length),
    );
    setRejections(result.rejected);
    if (result.rejected.length) { onReject?.(result.rejected); }
    if (result.accepted.length) { onFiles(result.accepted); }

  };

  function renderRejection({ file, reason }: FileRejection, index: number) {

    return (
      <p className="m-0 wrap-anywhere" key={`${index}:${file.name}`}>
        {copy.upload.rejection(file.name, reason)}
      </p>
    );

  }

  const rejectionMessages = rejections.map(renderRejection);

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="grid min-w-0 gap-3"
    >
      <p id={`${id}-label`} className="m-0 text-sm font-medium text-secondary">
        {label}
      </p>
      <DropZone disabled={disabled || full} onFiles={receive}>
        <UiIcon name="upload" className="size-6 text-tertiary" />
        <div className="min-w-0 flex-1 basis-48">
          <p id={`${id}-help`} className="m-0 text-sm text-secondary">
            {description ?? copy.upload.dropHint}
          </p>
          <p className="m-0 mt-1 text-xs text-tertiary">
            {copy.upload.limits(
              accept,
              Number.isFinite(limit) ? limit : undefined,
              maxSizeBytes,
            )}
          </p>
          {full && (
            <p className="m-0 mt-1 text-xs text-secondary">
              {copy.upload.fullHint}
            </p>
          )}
        </div>
        <FileInput
          ref={input}
          id={id}
          accept={accept}
          multiple={multiple}
          required={required && !files.length}
          disabled={disabled || full}
          aria-label={label}
          aria-invalid={invalid || Boolean(rejections.length)}
          aria-describedby={`${id}-help${rejections.length ? ` ${id}-errors` : ''}`}
          onChange={(event) => {

            receive(event.target.files);
            event.target.value = '';

          }}
        />
        <Button
          variant="secondary"
          disabled={disabled || full}
          onClick={() => input.current?.click()}
        >
          {copy.upload.choose}
        </Button>
      </DropZone>
      <div
        id={`${id}-errors`}
        role="alert"
        className="grid gap-1 text-xs text-error-primary"
      >
        {rejectionMessages}
      </div>
      <FileList files={files} disabled={disabled} {...listProps} />
    </div>
  );

}
