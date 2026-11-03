'use client';

import { portalPublishingStrings } from '@/strings';
import { Field, Input, MarkdownEditor, TextArea } from '@/components/ui';
import { BlogImageFields } from './BlogImageFields';
import type { BlogBlockFieldsProps } from '../../models/blogBlockFieldsProps';

const copy = portalPublishingStrings.builder;

export function BlogBlockFields({
  block,
  disabled,
  errorPaths = [],
  onChangeAction,
  onUploadStateChangeAction,
}: BlogBlockFieldsProps) {

  const id = `blog-block-${block.id}`;
  const invalid = (key: string) => {

    const hasMatchingErrorPath = errorPaths.some((path) => {

      const matchesErrorPath =
        path === key || path.startsWith(`${key}.`);
      return matchesErrorPath;

    });

    return hasMatchingErrorPath;

  };
  const invalidProps = (key: string) => ({
    'aria-invalid': invalid(key),
    'aria-describedby': invalid(key) ? `${id}-error` : undefined,
  });
  const input = (
    key: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    maxLength = 200,
  ) => (
    <Field labelText={label}>
      <Input
        id={`${id}-${key}`}
        {...invalidProps(key)}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        type={key === 'url' ? 'url' : 'text'}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
  const text = (
    key: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    maxLength = 4000,
  ) => (
    <Field labelText={label}>
      <TextArea
        id={`${id}-${key}`}
        {...invalidProps(key)}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
  switch (block.contentType) {

    case 'header': {

      const headingInput = input(
        'text',
        copy.headingLabel,
        block.metaData.text,
        (value) => onChangeAction({
          ...block,
          metaData: { ...block.metaData, text: value },
        }),
      );

      return headingInput;

    }
    case 'footer': {

      const footerText = text(
        'text',
        copy.textLabel,
        block.metaData.text,
        (value) => onChangeAction({
          ...block,
          metaData: { ...block.metaData, text: value },
        }),
      );

      return footerText;

    }
    case 'section':
      return (
        <>
          {input(
            'title',
            copy.headingLabel,
            block.metaData.title ?? '',
            (value) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, title: value },
              }),
          )}
          {block.metaData.format === 'markdown' ? (
            <>
              <p className="m-0 text-sm text-tertiary">
                {copy.legacyFormatHint}
              </p>
              <Field labelText={copy.textLabel}>
                <MarkdownEditor
                  id={`${id}-body`}
                  {...invalidProps('body')}
                  value={block.metaData.body}
                  maxLength={50000}
                  disabled={disabled}
                  onValueChange={(body) =>
                    onChangeAction({
                      ...block,
                      metaData: { ...block.metaData, body },
                    })
                  }
                />
              </Field>
            </>
          ) : (
            text(
              'body',
              copy.textLabel,
              block.metaData.body,
              (body) =>
                onChangeAction({
                  ...block,
                  metaData: { ...block.metaData, body },
                }),
              20000,
            )
          )}
        </>
      );
    case 'quote':
      return (
        <>
          {text('text', copy.textLabel, block.metaData.text, (value) =>
            onChangeAction({
              ...block,
              metaData: { ...block.metaData, text: value },
            }),
          )}
          {input(
            'attribution',
            copy.attributionLabel,
            block.metaData.attribution ?? '',
            (value) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, attribution: value },
              }),
          )}
        </>
      );
    case 'bullet':
      return (
        <>
          {text(
            'items',
            copy.itemsLabel,
            block.metaData.items.join('\n'),
            (value) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, items: value.split('\n') },
              }),
            30029,
          )}
          <p className="m-0 text-sm text-tertiary">{copy.itemsHint}</p>
        </>
      );
    case 'divider':
      return <p className="m-0 text-sm text-tertiary">{copy.dividerHint}</p>;
    case 'embed':
      return (
        <>
          {input(
            'title',
            copy.headingLabel,
            block.metaData.title ?? '',
            (title) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, title },
              }),
          )}
          {input(
            'url',
            copy.urlLabel,
            block.metaData.url,
            (url) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, url },
              }),
            2000,
          )}
          {input(
            'caption',
            copy.captionLabel,
            block.metaData.caption ?? '',
            (caption) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, caption },
              }),
            1000,
          )}
          <p className="m-0 text-sm text-tertiary">{copy.embedHint}</p>
        </>
      );
    case 'image':
      return (
        <BlogImageFields
          image={block.metaData}
          fieldId={id}
          errorKeys={errorPaths}
          errorId={`${id}-error`}
          disabled={disabled}
          onChangeAction={(image) =>
            onChangeAction({ ...block, metaData: image })
          }
          onUploadStateChangeAction={onUploadStateChangeAction}
        />
      );
    case 'gallery2':
    case 'gallery3':
    case 'gallery4':
      return (
        <>
          {block.metaData.images.map((image, index) => (
            <fieldset key={index} className="grid min-w-0 gap-3 border-0 p-0">
              <legend className="mb-3 text-sm font-semibold text-secondary">
                {copy.imageNumberLabel(index + 1)}
              </legend>
              <BlogImageFields
                image={image}
                fieldId={`${id}-${index}`}
                errorKeys={errorPaths
                  .filter((path) => path.startsWith(`images.${index}.`))
                  .map((path) => path.slice(`images.${index}.`.length))}
                errorId={`${id}-error`}
                disabled={disabled}
                onUploadStateChangeAction={onUploadStateChangeAction}
                onChangeAction={(next) => {

                  const images = block.metaData.images.map(
                    (current, currentIndex) => {

                      const image = currentIndex === index ? next : current;
                      return image;

                    },
                  );
                  const nextBlock = {
                    ...block,
                    metaData: {
                      ...block.metaData,
                      images,
                    },
                  };
                  onChangeAction(nextBlock);

                }}
              />
            </fieldset>
          ))}
          {input(
            'caption',
            copy.captionLabel,
            block.metaData.caption ?? '',
            (caption) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, caption },
              }),
            1000,
          )}
        </>
      );
    case 'callout':
      return (
        <>
          {input(
            'title',
            copy.headingLabel,
            block.metaData.title ?? '',
            (title) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, title },
              }),
          )}
          {text('text', copy.textLabel, block.metaData.text, (value) =>
            onChangeAction({
              ...block,
              metaData: { ...block.metaData, text: value },
            }),
          )}
        </>
      );
    case 'link':
      return (
        <>
          {input('text', copy.linkLabel, block.metaData.text, (value) =>
            onChangeAction({
              ...block,
              metaData: { ...block.metaData, text: value },
            }),
          )}
          {input(
            'url',
            copy.urlLabel,
            block.metaData.url,
            (url) =>
              onChangeAction({
                ...block,
                metaData: { ...block.metaData, url },
              }),
            2000,
          )}
        </>
      );

  }

}
