import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../lib/cn';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'rounded-[1.75rem] border border-secondary/90 bg-primary/95 p-6 shadow-[0_14px_34px_rgba(16,31,30,0.1)] backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
