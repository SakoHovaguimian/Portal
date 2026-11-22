'use client';

import { useState } from 'react';

import { AnimatedCounter, Button, IconButton, NumberStepper, SegmentedTabs, UiIcon } from '@/components/ui';
import type { AnimatedCounterProps } from '@/components/ui';
import { interactiveComponentStrings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = interactiveComponentStrings.animatedCounter;

export function AnimatedCounterShowcase() {

  const [value, setValue] = useState(99_999.5);
  const [decimals, setDecimals] = useState(2);
  const [grouping, setGrouping] = useState<NonNullable<AnimatedCounterProps['grouping']>>('western');

  return (
    <ShowcaseSection id="animated-counter" title={copy.title} description={copy.description} icon="chart">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <div className="grid min-w-0 justify-items-center gap-3">
          <AnimatedCounter
            value={value}
            decimals={decimals}
            grouping={grouping}
            suffix={<span className="ms-2 text-[0.45em] font-medium text-secondary">{copy.currencyCode}</span>}
            className="max-w-full text-[clamp(1.125rem,6vw,3rem)] font-semibold text-primary"
          />
          <div className="flex flex-wrap justify-center gap-2">
            <IconButton label={copy.decreaseAction} onClick={() => { setValue((current) => current - 1); }}>
              <UiIcon name="minus" />
            </IconButton>
            <IconButton label={copy.increaseAction} onClick={() => { setValue((current) => current + 1); }}>
              <UiIcon name="plus" />
            </IconButton>
            <Button variant="secondary" onClick={() => { setValue((current) => -current); }}>
              {copy.reverseAction}
            </Button>
          </div>
        </div>
        <div className="grid min-w-0 gap-4">
          <NumberStepper
            label={copy.decimalsLabel}
            minValue={0}
            maxValue={3}
            value={decimals}
            onValueChange={setDecimals}
          />
          <SegmentedTabs label={copy.groupingLabel} value={grouping} onValueChange={setGrouping} tabs={[...copy.groupingOptions]} />
        </div>
      </div>
    </ShowcaseSection>
  );

}
