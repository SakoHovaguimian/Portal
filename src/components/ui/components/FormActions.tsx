import type { FormActionsProps } from '../models/formActionsProps';
import { strings } from '@/strings';
import { cn } from '../lib/cn';

export function FormActions({
  children,
  description,
  sticky = true,
  live = false,
  variant = 'panel',
}: FormActionsProps) {

  return (
    <div
      role="group"
      aria-label={strings.pageLayout.formActions}
      className={cn(
        'ui-form-actions flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3',
        variant === 'inline' && 'border-t-control border-secondary pt-4',
        variant === 'panel' && [
          'rounded-card border-control border-secondary bg-primary px-4 py-3 sm:px-5',
          sticky
            ? 'ui-form-actions-sticky shadow-(--shadow-overlay)'
            : 'shadow-(--shadow-card)',
        ],
      )}
    >
      {(description || live) && (
        <p
          role={live ? 'status' : undefined}
          aria-live={live ? 'polite' : undefined}
          className="m-0 min-w-0 flex-1 basis-64 text-sm text-secondary"
        >
          {description}
        </p>
      )}
      <div className="flex w-full flex-wrap gap-3 sm:ms-auto sm:w-auto sm:justify-end">
        {children}
      </div>
    </div>
  );

}
