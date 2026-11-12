'use client';

import { cloneElement, isValidElement, useId, type ReactElement } from 'react';

import { cn } from '../lib/cn';
import type { FieldProps } from '../models/fieldProps';

export function Field({
  labelText,
  children,
  className,
  orientation = 'vertical',
}: FieldProps) {

  const generatedId = useId();
  const control = isValidElement<{ id?: string; 'aria-labelledby'?: string }>(
    children,
  )
    ? children
    : undefined;
  const id = control?.props.id ?? generatedId;
  return (
    <div
      className={cn(
        'flex min-w-0 text-sm font-medium text-secondary',
        orientation === 'inline'
          ? 'flex-row items-center gap-3 [&>label]:shrink-0 [&>label]:text-tertiary'
          : 'flex-col gap-2',
        className,
      )}
    >
      <label id={`${id}-label`} htmlFor={id}>
        {labelText}
      </label>
      {control
        ? cloneElement(
            control as ReactElement<{
              id?: string;
              'aria-labelledby'?: string;
            }>,
            {
              id,
              'aria-labelledby':
                control.props['aria-labelledby'] ?? `${id}-label`,
            },
        )
        : children}
    </div>
  );

}
