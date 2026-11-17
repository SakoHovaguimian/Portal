import { cn } from '../lib/cn';
import type { IconTileProps } from '../models/iconTileProps';
import type { UiIntent } from '../models/uiIntent';

const tones: Record<UiIntent | 'brand', string> = {
  brand: 'bg-brand-secondary text-brand-secondary',
  neutral: 'bg-secondary text-tertiary',
  info: 'bg-utility-blue-50 text-utility-blue-700',
  success: 'bg-utility-success-50 text-utility-success-700',
  warning: 'bg-utility-warning-50 text-utility-warning-700',
  danger: 'bg-utility-error-50 text-utility-error-700',
};

export function IconTile({
  children,
  className,
  intent = 'brand',
  size = 'md',
}: IconTileProps) {

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        size === 'md' ? 'size-11 rounded-card' : 'size-9 rounded-control',
        tones[intent],
        className,
      )}
    >
      {children}
    </span>
  );

}
