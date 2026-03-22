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
    <div className="inline-flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-secondary bg-primary/90 p-2 shadow-xs">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'rounded-2xl px-4 py-2 text-left text-sm transition',
              active
                ? 'bg-brand-solid text-white shadow-xs-skeumorphic'
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
