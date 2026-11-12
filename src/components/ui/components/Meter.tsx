'use client';

import { useId } from 'react';
import { I18nProvider } from 'react-aria';
import { Label, Meter as AriaMeter } from 'react-aria-components';

import { cn } from '../lib/cn';
import type { MeterProps } from '../models/meterProps';
import './ValueControls.css';

/** A measurement (e.g. storage used), rather than work in progress. */
export function Meter({
  label,
  description,
  showValue = true,
  size = 'md',
  tone = 'brand',
  locale = 'en-US',
  className,
  ...props
}: MeterProps) {

  const helpId = useId();
  const describedBy =
    [props['aria-describedby'], description ? helpId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <I18nProvider locale={locale}>
      <AriaMeter
        {...props}
        aria-describedby={describedBy}
        data-size={size}
        data-tone={tone}
        className={cn('ui-value-control ui-meter', className)}
      >
        {({ percentage, valueText }) => (
          <>
            <div className="ui-value-heading">
              <Label className="ui-value-label">{label}</Label>
              {showValue && (
                <span className="ui-value-output">{valueText}</span>
              )}
            </div>
            <div aria-hidden="true" className="ui-progress-track">
              <div
                className="ui-progress-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
            {description && (
              <p id={helpId} className="ui-value-help">
                {description}
              </p>
            )}
          </>
        )}
      </AriaMeter>
    </I18nProvider>
  );

}
