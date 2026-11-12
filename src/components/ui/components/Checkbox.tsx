'use client';

import { useState } from 'react';

import { cn } from '../lib/cn';
import type { CheckboxProps } from '../models/checkboxProps';

import { UiIcon } from './UiIcon';

export function Checkbox({
  label,
  description,
  className,
  onChange,
  ...props
}: CheckboxProps) {

  // Selection motion plays only after a person changes the value, never on mount.
  const [interacted, setInteracted] = useState(false);
  return (
    <label
      data-interacted={interacted || undefined}
      className={cn(
        'ui-choice-label flex min-h-(--control-height-md) cursor-pointer items-center gap-3 text-sm text-secondary has-[:disabled]:cursor-not-allowed has-[:disabled]:text-disabled',
        className,
      )}
    >
      <span className="ui-choice-frame relative isolate inline-flex size-5 shrink-0">
        <input
          type="checkbox"
          className="ui-choice ui-checkbox m-0 size-5 cursor-pointer appearance-none rounded-(--ui-choice-radius) border-control border-control-border bg-primary checked:border-brand checked:bg-brand-solid indeterminate:border-brand indeterminate:bg-brand-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand disabled:cursor-not-allowed"
          onChange={(event) => {

            setInteracted(true);
            onChange?.(event);

          }}
          {...props}
        />
        <UiIcon
          name="check"
          className="ui-checkbox-mark pointer-events-none absolute inset-0 size-5 p-0.5 text-text-primary_on-brand"
        />
        <span
          aria-hidden="true"
          className="ui-checkbox-mixed pointer-events-none absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-text-primary_on-brand"
        />
      </span>
      <span className="min-w-0 wrap-anywhere">
        {label}
        {description && (
          <span className="ui-choice-description mt-0.5 block text-xs text-tertiary">
            {description}
          </span>
        )}
      </span>
    </label>
  );

}
