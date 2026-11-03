import type { DescriptionListProps } from '../models/descriptionListProps';
import { cn } from '../lib/cn';
import { UiIcon } from './UiIcon';

// Grid suits wide review summaries; rows suit narrow side panels where each
// label sits beside its value with a divider between facts.
export function DescriptionList({
  items,
  layout = 'grid',
  className,
}: DescriptionListProps) {

  if (layout === 'rows') {

    function renderDetailRow({ label, value }: (typeof items)[number]) {

      return (
        <div
          key={label}
          className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0"
        >
          <dt className="text-sm text-tertiary">{label}</dt>
          <dd className="m-0 ms-auto min-w-0 text-right text-sm font-medium text-primary wrap-anywhere">
            {value}
          </dd>
        </div>
      );

    }

    const detailRows = items.map(renderDetailRow);

    return (
      <dl
        className={cn(
          'm-0 grid min-w-0 divide-y-control divide-secondary',
          className,
        )}
      >
        {detailRows}
      </dl>
    );

  }

  function renderDetailItem({ label, value, icon, fullWidth }: (typeof items)[number]) {

    return (
      <div
        key={label}
        className={cn(
          'grid min-w-0 content-start gap-1',
          fullWidth && 'col-span-full',
        )}
      >
        <dt className="flex min-w-0 items-start gap-1.5 text-xs text-tertiary">
          {icon && <UiIcon name={icon} className="mt-0.5 size-4 shrink-0" />}
          <span className="min-w-0 wrap-anywhere">{label}</span>
        </dt>
        <dd className="m-0 min-w-0 text-sm font-medium text-primary wrap-anywhere">
          {value}
        </dd>
      </div>
    );

  }

  const detailItems = items.map(renderDetailItem);

  return (
    <dl
      className={cn(
        layout === 'compact'
          ? 'm-0 grid min-w-0 grid-cols-2 gap-x-4 gap-y-4'
          : 'm-0 grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2',
        className,
      )}
    >
      {detailItems}
    </dl>
  );

}
