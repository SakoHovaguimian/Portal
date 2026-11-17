import {
  Button,
  Field,
  FileInput,
  Input,
  Message,
  Select,
  UiIcon,
} from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import type { BlogCoverFieldProps } from '../models/blogCoverFieldProps';
import { BlogCoverPresetSchema } from '../models/blogCoverPreset';
import { blogImageMimeTypes } from '../models/blogMedia';
import { useBlogImageUpload } from '../useBlogImageUpload';

const copy = portalPublishingStrings.article;
const builderCopy = portalPublishingStrings.builder;

export function BlogCoverField({
  value,
  covers,
  disabled,
  invalid,
  onChange,
  onUploadStateChange,
}: BlogCoverFieldProps) {

  const { picker, trigger, uploading, failure, upload, setFailure, cancel } =
    useBlogImageUpload({ disabled, onUploaded: onChange, onUploadStateChange });
  const custom = !BlogCoverPresetSchema.safeParse(value).success;
  const choices = [
    ...new Map(
      covers
        .filter(
          (cover) => !BlogCoverPresetSchema.safeParse(cover.value).success,
        )
        .map((cover) => [cover.value, cover]),
    ).values(),
  ];
  if (custom && !choices.some((cover) => cover.value === value)) { choices.unshift({ value, title: copy.decorativeAlt }); }
  return (
    <div className="grid min-w-0 gap-2">
      <Field labelText={copy.coverLabel}>
        <Select
          id="blog-cover"
          value={value}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={invalid ? 'blog-cover-error' : undefined}
          onValueChange={(next) => {

            setFailure('');
            onChange(next);

          }}
        >
          {BlogCoverPresetSchema.options.map((cover) => (
            <option key={cover} value={cover}>
              {copy.coverOptions[cover]}
            </option>
          ))}
          {choices.map((cover) => (
            <option key={cover.value} value={cover.value}>
              {cover.title
                ? copy.coverFromArticle(cover.title)
                : copy.customCover}
            </option>
          ))}
        </Select>
      </Field>
      {custom ? (
        <div className="grid min-w-0 gap-3 pt-2" aria-busy={uploading}>
          <p className="m-0 text-xs text-tertiary">{builderCopy.uploadHint}</p>
          <FileInput
            ref={picker}
            tabIndex={-1}
            aria-hidden="true"
            id="blog-cover-file"
            accept={blogImageMimeTypes.join(',')}
            disabled={disabled || uploading}
            aria-label={copy.addCover}
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <Button
            ref={trigger}
            variant="secondary"
            disabled={disabled}
            loading={uploading}
            className="justify-self-start"
            onClick={() => picker.current?.click()}
          >
            <UiIcon name="upload" className="size-4" />
            {builderCopy.upload}
          </Button>
          {uploading && (
            <Button variant="ghost" onClick={cancel}>
              {builderCopy.cancelUpload}
            </Button>
          )}
          <Field labelText={builderCopy.imageUrlLabel}>
            <Input
              id="blog-cover-url"
              type="url"
              value={value}
              disabled={disabled || uploading}
              maxLength={2000}
              aria-invalid={invalid}
              aria-describedby={invalid ? 'blog-cover-error' : undefined}
              onChange={(event) => {

                setFailure('');
                onChange(event.target.value);

              }}
            />
          </Field>
          {failure && (
            <Message
              intent="danger"
              title={builderCopy.uploadErrorTitle}
              description={failure}
            />
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          className="justify-self-start px-2 py-1"
          disabled={disabled}
          onClick={() => {

            onChange('');
            requestAnimationFrame(() =>
              document.getElementById('blog-cover-url')?.focus(),
            );

          }}
        >
          <UiIcon name="plus" className="size-4" />
          {copy.addCover}
        </Button>
      )}
    </div>
  );

}
