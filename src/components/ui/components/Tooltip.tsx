'use client';

import { Button as AriaButton, Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';

import { buttonClassName } from '../lib/buttonStyles';
import type { TooltipProps } from '../models/tooltipProps';

export function Tooltip({
  label,
  content,
  children,
  className,
  triggerClassName,
}: TooltipProps) {

  return (
    <TooltipTrigger delay={200}>
      <AriaButton
        aria-label={label}
        className={triggerClassName ?? buttonClassName('secondary')}
      >
        {children}
      </AriaButton>
      <AriaTooltip
        offset={8}
        className={
          className ??
        'ui-tooltip z-100 max-w-64 rounded-overlay border-control border-secondary bg-primary px-4 py-3 text-xs text-secondary shadow-(--shadow-overlay)'
        }
      >
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );

}
