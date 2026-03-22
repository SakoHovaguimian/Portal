import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: ReactNode;
};

export function Input({ id, className, leadingIcon, ...props }: InputProps) {
  return (
    <div className="relative">
      {leadingIcon ? (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-tertiary">
          {leadingIcon}
        </span>
      ) : null}
      <input
        id={id}
        className={cn(
          'w-full rounded-xl border border-secondary bg-primary px-4 py-2.5 text-sm text-primary shadow-xs outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled',
          leadingIcon ? 'pl-11' : null,
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Field({ labelText, children }: { labelText: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-secondary">
      <span>{labelText}</span>
      {children}
    </label>
  );
}
