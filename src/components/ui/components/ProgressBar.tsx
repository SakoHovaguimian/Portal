'use client';

import { useId } from 'react';
import { I18nProvider } from 'react-aria';
import { Label, ProgressBar as AriaProgressBar } from 'react-aria-components';
import { cn } from '../lib/cn';
import type { ProgressBarProps } from '../models/progressBarProps';
import './ValueControls.css';

export function ProgressBar({
  label,
  description,
  indeterminate = false,
  showValue = true,
  size = 'md',
  tone = 'brand',
  locale = 'en-US',
  className,
  ...props
}: ProgressBarProps) {
  const helpId = useId();
  const describedBy =
    [props['aria-describedby'], description ? helpId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <I18nProvider locale={locale}>
      <AriaProgressBar
        {...props}
        aria-describedby={describedBy}
        isIndeterminate={indeterminate}
        data-size={size}
        data-tone={tone}
        className={cn('ui-value-control ui-progress', className)}
      >
        {({ percentage, valueText }) => (
          <>
            <div className="ui-value-heading">
              <Label className="ui-value-label">{label}</Label>
              {showValue && !indeterminate && (
                <span className="ui-value-output">{valueText}</span>
              )}
            </div>
            <div
              aria-hidden="true"
              className="ui-progress-track"
              data-indeterminate={indeterminate || undefined}
            >
              <div
                className="ui-progress-fill"
                style={{ width: indeterminate ? undefined : `${percentage}%` }}
              />
            </div>
            {description && (
              <p id={helpId} className="ui-value-help">
                {description}
              </p>
            )}
          </>
        )}
      </AriaProgressBar>
    </I18nProvider>
  );
}
