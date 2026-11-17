'use client';

import { useId, useState } from 'react';

import { cn } from '../lib/cn';
import type { RadioProps } from '../models/radioProps';

export function Radio({
  label,
  className,
  id,
  onChange,
  ...props
}: RadioProps) {

  const generatedId = useId();
  const inputId = id ?? generatedId;
  // Selection motion plays only after a person changes the value, never on mount.
  const [interacted, setInteracted] = useState(false);

  return (
    <label
      htmlFor={inputId}
      data-interacted={interacted || undefined}
      className={cn(
        'ui-choice-label flex min-h-(--control-height-md) cursor-pointer items-center gap-3 text-sm text-secondary has-[:disabled]:cursor-not-allowed has-[:disabled]:text-disabled',
        className,
      )}
    >
      <span className="ui-choice-frame relative isolate inline-flex size-5 shrink-0">
        <input
          type="radio"
          id={inputId}
          className="ui-choice ui-radio absolute inset-0 m-0 size-5 cursor-pointer rounded-full border-control border-control-border bg-primary checked:border-brand focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand disabled:cursor-not-allowed"
          onChange={(event) => {

            setInteracted(true);
            onChange?.(event);

          }}
          {...props}
        />
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          className="ui-radio-dot pointer-events-none absolute top-1 left-1 size-3 text-bg-brand-solid"
        >
          <circle cx="6" cy="6" r="6" fill="currentColor" />
        </svg>
      </span>
      <span className="min-w-0 wrap-anywhere">{label}</span>
    </label>
  );

}
