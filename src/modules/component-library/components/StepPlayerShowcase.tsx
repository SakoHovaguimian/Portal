'use client';

import { useState } from 'react';

import { SegmentedTabs, Slider, StepPlayer, Switch } from '@/components/ui';
import { interactiveComponentStrings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = interactiveComponentStrings.stepPlayer;

export function StepPlayerShowcase() {

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(2);
  const [loop, setLoop] = useState(false);
  const [seekable, setSeekable] = useState(true);
  const [position, setPosition] = useState<'left' | 'right'>('right');

  return (
    <ShowcaseSection id="step-player" title={copy.title} description={copy.description} icon="play">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <div className="grid min-w-0 justify-items-center gap-3">
          <p className="m-0 text-base font-medium text-primary">{copy.sample[index]?.label}</p>
          <StepPlayer
            steps={copy.sample}
            value={index}
            onValueChange={setIndex}
            playing={playing}
            onPlayingChange={setPlaying}
            duration={duration * 1000}
            seekable={seekable}
            loop={loop}
            controlPosition={position}
          />
        </div>
        <div className="grid min-w-0 gap-4">
          <Slider
            label={copy.durationLabel}
            min={1}
            max={5}
            step={0.5}
            value={duration}
            onValueChange={setDuration}
            formatOptions={{ style: 'unit', unit: 'second', unitDisplay: 'short' }}
            showValue
          />
          <SegmentedTabs label={copy.positionLabel} value={position} onValueChange={setPosition} tabs={[...copy.positionOptions]} />
          <Switch label={copy.seekableLabel} checked={seekable} onChange={(event) => setSeekable(event.target.checked)} />
          <Switch label={copy.loopLabel} checked={loop} onChange={(event) => setLoop(event.target.checked)} />
        </div>
      </div>
    </ShowcaseSection>
  );

}
