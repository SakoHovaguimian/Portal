'use client';

import { cloneElement, isValidElement, useId, type AriaAttributes } from 'react';

import { cn } from '../lib/cn';
import type { FieldProps } from '../models/fieldProps';

export function Field({
  labelText,
  children,
  className,
  error,
  orientation = 'vertical',
}: FieldProps) {

  const generatedId = useId();
  const control = isValidElement<AriaAttributes & { id?: string }>(children)
    ? children
    : undefined;
  const id = control?.props.id ?? generatedId;
  const errorId = `${id}-error`;
  const describedBy = control?.props['aria-describedby'];
  const field = control
    ? cloneElement(control, {
      id,
      'aria-labelledby': control.props['aria-labelledby'] ?? `${id}-label`,
      ...(error && {
        'aria-invalid': true,
        'aria-describedby': describedBy ? `${describedBy} ${errorId}` : errorId,
      }),
    })
    : children;
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
      {field}
      {error && <p id={errorId} className="m-0 text-xs font-normal text-error-primary">{error}</p>}
    </div>
  );

}
