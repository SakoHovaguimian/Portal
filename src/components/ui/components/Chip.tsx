import { cn } from '../lib/cn';
import type { ChipProps } from '../models/chipProps';

export function Chip({
  children,
  icon,
  selected = false,
  className,
}: ChipProps) {

  return (
    <span
      data-selected={selected || undefined}
      className={cn(
        'ui-chip inline-flex items-center gap-2 rounded-chip border-control border-secondary bg-secondary_subtle px-3 py-1.5 text-sm text-secondary',
        className,
      )}
    >
      {icon}
      <span
        key={typeof children === 'string' ? children : undefined}
        className="ui-token-value"
      >
        {children}
      </span>
    </span>
  );

}
