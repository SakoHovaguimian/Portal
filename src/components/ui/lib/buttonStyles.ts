import { cn } from './cn';
import type { ButtonVariant } from '../models/buttonVariant';

const buttonVariants = {
  primary:
    'bg-brand-solid ui-button-primary text-text-primary_on-brand shadow-(--shadow-control) ring-(length:--border-width-control) ring-transparent ring-inset hover:bg-brand-solid_hover disabled:bg-disabled disabled:text-disabled disabled:ring-disabled_subtle',
  secondary:
    'bg-primary text-secondary shadow-(--shadow-control) ring-(length:--border-width-control) ring-secondary ring-inset hover:bg-primary_hover hover:text-secondary_hover disabled:bg-disabled_subtle disabled:text-fg-disabled disabled:ring-disabled',
  destructive:
    'bg-error-primary text-error-primary ring-(length:--border-width-control) ring-error_subtle ring-inset hover:bg-error-secondary disabled:bg-disabled_subtle disabled:text-disabled disabled:ring-disabled_subtle',
  ghost:
    'bg-transparent text-secondary ring-(length:--border-width-control) ring-transparent hover:bg-secondary_subtle hover:text-primary disabled:text-fg-disabled',
} as const;

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  className?: string,
) {

  return cn(
    'ui-button group relative isolate inline-flex min-h-(--control-height-md) h-max cursor-pointer items-center justify-center gap-2 rounded-control px-4 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed',
    buttonVariants[variant],
    className,
  );

}
