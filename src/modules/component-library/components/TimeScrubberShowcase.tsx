'use client';

import { useState } from 'react';

import { SegmentedTabs, Slider, TimeScrubber } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.time;
const increments = [5, 15, 30] as const;
const twelveHours = '12';
const twentyFourHours = '24';

export function TimeScrubberShowcase() {

  const [minutes, setMinutes] = useState(570);
  const [step, setStep] = useState('15');
  const [cycle, setCycle] = useState<string>(twelveHours);
  const [momentum, setMomentum] = useState(50);
  const steps = increments.map((increment) => ({ value: String(increment), label: copy.minutesValue(increment) }));

  return (
    <ShowcaseSection id="time-scrubber" title={copy.title} description={copy.description} icon="clock">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <TimeScrubber className="mx-auto w-full max-w-md" label={copy.label} stepMinutes={Number(step)} value={minutes} onValueChange={setMinutes} hourCycle={cycle === twelveHours ? 12 : 24} momentum={momentum} />
        <div className="grid min-w-0 gap-4">
          <SegmentedTabs label={copy.stepLabel} value={step} onValueChange={setStep} tabs={steps} />
          <SegmentedTabs label={copy.formatLabel} value={cycle} onValueChange={setCycle} tabs={[{ value: twelveHours, label: copy.twelveOption }, { value: twentyFourHours, label: copy.twentyFourOption }]} />
          <Slider label={copy.momentumLabel} value={momentum} onValueChange={setMomentum} showValue />
        </div>
      </div>
    </ShowcaseSection>
  );

}
