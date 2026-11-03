import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';
import type { ActivityIndicatorProps } from '../models/activityIndicatorProps';
import './ValueControls.css';

export function ActivityIndicator({
  label,
  size = 'md',
  tone = 'neutral',
  showLabel = false,
  className,
}: ActivityIndicatorProps) {

  return (
    <span
      role="status"
      className={cn('ui-value-control ui-activity', className)}
      data-size={size}
      data-tone={tone}
    >
      <span className="ui-activity-wheel" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} style={{ '--spoke': index } as CSSProperties} />
        ))}
      </span>
      <span className={showLabel ? 'ui-value-label' : 'sr-only'}>{label}</span>
    </span>
  );

}
