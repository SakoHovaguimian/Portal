import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../lib/cn';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
