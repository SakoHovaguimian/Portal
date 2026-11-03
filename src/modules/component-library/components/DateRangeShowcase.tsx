'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRangeValue } from '@/components/ui';
import { componentExpansionStrings as copy } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';

const initial: DateRangeValue = { start: '2026-11-03', end: '2026-11-12' };
export function DateRangeShowcase() {

  const [value, setValue] = useState<DateRangeValue | null>(initial);
  const [invalid, setInvalid] = useState<DateRangeValue | null>(null);
  return (
    <ShowcaseSection
      id="dateRange"
      title={copy.examples.rangeTitle}
      description={copy.examples.rangeDescription}
      icon="calendar"
    >
      <div className="grid items-start gap-6 2xl:grid-cols-2">
        <div className="grid gap-3">
          <DateRangePicker
            label={copy.examples.rangeLabel}
            description={copy.examples.rangeHint}
            value={value}
            onValueChange={setValue}
            min="2026-11-01"
            max="2026-12-31"
          />
          <p role="status" className="m-0 text-xs text-tertiary">
            {value
              ? copy.examples.rangeSummary(value.start, value.end)
              : copy.examples.rangeEmpty}
          </p>
        </div>
        <DateRangePicker
          label={copy.examples.rangeInvalid}
          value={invalid}
          onValueChange={setInvalid}
          error={invalid ? undefined : copy.examples.rangeError}
          required
        />
        <DateRangePicker
          label={copy.examples.rangeDisabled}
          value={initial}
          onValueChange={() => {}}
          disabled
        />
        <DateRangePicker
          label={copy.examples.rangeReadOnly}
          value={initial}
          onValueChange={() => {}}
          readOnly
        />
      </div>
    </ShowcaseSection>
  );

}
