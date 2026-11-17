import { cn } from '../lib/cn';
import type { SpinnerProps } from '../models/spinnerProps';

export function Spinner({ className }: SpinnerProps) {

  return (
    <span
      aria-hidden="true"
      className={cn(
        'ui-spinner inline-block size-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
    />
  );

}
