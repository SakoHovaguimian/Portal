'use client';

import type { SwitchProps } from '../models/switchProps';
import { useState } from 'react';
import { cn } from '../lib/cn';

export function Switch({
  label,
  description,
  className,
  onChange,
  ...props
}: SwitchProps) {

  const [interacted, setInteracted] = useState(false);
  return (
    <label
      data-interacted={interacted || undefined}
      className={cn(
        'ui-switch-label flex min-h-(--control-height-md) cursor-pointer items-center gap-3 text-sm text-secondary has-[:disabled]:cursor-not-allowed has-[:disabled]:text-disabled',
        className,
      )}
    >
      <span className="ui-switch-frame relative isolate inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          className="ui-switch peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full border-control border-control-border bg-quaternary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => {

            setInteracted(true);
            onChange?.(event);

          }}
          {...props}
        />
        <span
          aria-hidden="true"
          className="ui-switch-thumb pointer-events-none absolute rounded-full bg-switch-thumb shadow-xs peer-disabled:opacity-70"
        />
      </span>
      <span className="min-w-0 wrap-anywhere">
        {label}
        {description && (
          <span className="mt-0.5 block text-xs text-tertiary">
            {description}
          </span>
        )}
      </span>
    </label>
  );

}
