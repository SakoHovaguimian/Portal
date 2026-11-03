'use client';

import type { MarkdownEditorProps } from '../models/markdownEditorProps';
import { useId, useState } from 'react';
import { strings } from '@/strings';
import { useMarkdownEditor } from '../lib/useMarkdownEditor';
import { cn } from '../lib/cn';
import { MarkdownContent } from './MarkdownContent';
import { MarkdownToolbar } from './MarkdownToolbar';
import { SegmentedTabs } from './Tabs';
import { TextArea } from './TextArea';

const views = { write: 'write', preview: 'preview', split: 'split' } as const;

export function MarkdownEditor({
  id,
  value,
  onValueChange,
  disabled = false,
  required = false,
  maxLength = 100000,
  'aria-labelledby': labelledBy,
}: MarkdownEditorProps) {

  const generated = useId();
  const inputId = id ?? generated;
  const [mode, setMode] = useState<'write' | 'preview' | 'split'>('write');
  const {
    inputRef,
    availability,
    limitReached,
    apply,
    undo,
    redo,
    onKeyDown,
    write,
  } = useMarkdownEditor(value, onValueChange, maxLength, disabled);
  const copy = strings.markdownEditor;

  function renderSyntaxHint(item: (typeof copy.syntax)[number]) {

    return (
      <div key={item.label} className="grid min-w-0 gap-1">
        <span className="font-medium">{item.label}</span>
        <code className="whitespace-pre-wrap font-mono text-xs wrap-anywhere">
          {item.example}
        </code>
      </div>
    );

  }

  const syntaxHints = copy.syntax.map(renderSyntaxHint);

  return (
    <div className="@container grid min-w-0 gap-3 font-normal">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <SegmentedTabs
          label={copy.view}
          value={mode}
          onValueChange={setMode}
          tabs={[
            {
              value: views.write,
              label: copy.write,
              panelId: `${inputId}-source`,
            },
            {
              value: views.preview,
              label: copy.preview,
              panelId: `${inputId}-preview`,
            },
            {
              value: views.split,
              label: copy.split,
              panelId: `${inputId}-panels`,
            },
          ]}
        />
        <span className="text-xs text-tertiary">
          {copy.characters(value.length, maxLength)}
        </span>
      </div>
      <MarkdownToolbar
        disabled={disabled || mode === 'preview'}
        apply={apply}
        undo={undo}
        redo={redo}
        canUndo={availability.undo}
        canRedo={availability.redo}
      />
      <div
        id={`${inputId}-panels`}
        className={cn(
          'grid min-w-0 items-start gap-4',
          mode === 'split' && '@3xl:grid-cols-2',
        )}
      >
        <div
          id={`${inputId}-source`}
          hidden={mode === 'preview'}
          className="min-w-0"
        >
          <TextArea
            ref={inputRef}
            id={inputId}
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : copy.source}
            aria-describedby={`${inputId}-hint`}
            rows={18}
            className="min-h-96 resize-none font-mono leading-relaxed"
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            onChange={(event) => write(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div
          id={`${inputId}-preview`}
          hidden={mode === 'write'}
          role="region"
          aria-label={copy.preview}
          tabIndex={0}
          className="min-h-96 min-w-0 rounded-control border-control border-secondary bg-primary p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {value.trim() ? (
            <MarkdownContent value={value} />
          ) : (
            <p className="m-0 text-sm text-tertiary">{copy.emptyPreview}</p>
          )}
        </div>
      </div>
      <p id={`${inputId}-hint`} className="m-0 text-xs text-tertiary">
        {copy.hint}
      </p>
      {limitReached && (
        <p role="alert" className="m-0 text-sm text-error-primary">
          {copy.limitReached(maxLength)}
        </p>
      )}
      <details className="text-sm text-secondary">
        <summary className="min-h-(--control-height-md) cursor-pointer py-2 font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          {copy.guide}
        </summary>
        <div className="mt-2 grid min-w-0 gap-3 rounded-control border-control border-secondary bg-secondary_subtle p-4 sm:grid-cols-2">
          {syntaxHints}
        </div>
      </details>
    </div>
  );

}
