'use client';

import { useId } from 'react';
import { I18nProvider } from 'react-aria';
import { Label, ProgressBar as AriaProgressBar } from 'react-aria-components';

import { cn } from '../lib/cn';
import type { ProgressRingProps } from '../models/progressRingProps';
import './ValueControls.css';

export function ProgressRing({
  label,
  description,
  indeterminate = false,
  showValue = true,
  size = 'md',
  tone = 'brand',
  locale = 'en-US',
  className,
  ...props
}: ProgressRingProps) {

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
        className={cn('ui-value-control ui-progress-ring', className)}
      >
        {({ percentage, valueText }) => (
          <>
            <div
              className="ui-progress-ring-face"
              data-indeterminate={indeterminate || undefined}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="ui-progress-ring-svg"
              >
                <circle
                  className="ui-progress-ring-track"
                  cx="50"
                  cy="50"
                  r="44"
                  pathLength="100"
                />
                <circle
                  className="ui-progress-ring-fill"
                  cx="50"
                  cy="50"
                  r="44"
                  pathLength="100"
                  strokeDasharray={`${indeterminate ? 25 : percentage} 100`}
                />
              </svg>
              {showValue && !indeterminate && (
                <span className="ui-value-output">{valueText}</span>
              )}
            </div>
            <div className="ui-progress-ring-copy">
              <Label className="ui-value-label">{label}</Label>
              {description && (
                <p id={helpId} className="ui-value-help">
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </AriaProgressBar>
    </I18nProvider>
  );

}
