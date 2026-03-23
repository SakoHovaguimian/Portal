'use client';

import { cn } from '../lib/cn';

export type SegmentedTab<T extends string> = {
  value: T;
  label: string;
  meta?: string;
};

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onValueChange,
}: {
  tabs: Array<SegmentedTab<T>>;
  value: T;
  onValueChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-secondary bg-secondary_subtle p-1.5">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-left text-sm transition',
              active
                ? 'bg-primary text-primary shadow-[var(--dashboard-shell-shadow)] ring-1 ring-secondary'
                : 'text-secondary hover:bg-secondary_subtle hover:text-primary',
            )}
          >
            <span className="block font-semibold">{tab.label}</span>
            {tab.meta ? <span className={cn('mt-0.5 block text-xs', active ? 'text-white/75' : 'text-tertiary')}>{tab.meta}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
