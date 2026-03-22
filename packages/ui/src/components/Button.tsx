import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../lib/cn';

const buttonVariants = {
  primary:
    'bg-brand-solid text-white shadow-xs ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover disabled:bg-disabled disabled:text-fg-disabled disabled:ring-disabled_subtle',
  secondary:
    'bg-primary text-secondary shadow-xs ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover disabled:bg-disabled_subtle disabled:text-fg-disabled disabled:ring-disabled',
  destructive:
    'bg-error-primary text-white shadow-xs ring-1 ring-transparent ring-inset hover:bg-error-primary/90 disabled:bg-disabled disabled:text-fg-disabled disabled:ring-disabled_subtle',
  ghost:
    'bg-transparent text-secondary ring-1 ring-transparent hover:bg-secondary_subtle hover:text-primary disabled:text-fg-disabled',
} as const;

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof buttonVariants;
    asChild?: boolean;
  }
>;

export function Button({ children, variant = 'primary', asChild = false, className, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'bouncy-button group inline-flex h-max items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed',
        buttonVariants[variant],
        className,
      )}
      {...(!asChild ? { type: type ?? 'button' } : {})}
      {...props}
    >
      {children}
    </Comp>
  );
}
