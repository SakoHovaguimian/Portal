'use client';

import { useState } from 'react';

import { Slider, Switch, VoiceNote } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { captureSampleVoiceNote } from '../lib/sampleVoiceNote';
import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.voice;

export function VoiceNoteShowcase() {

  const [bars, setBars] = useState(28);
  const [sensitivity, setSensitivity] = useState(60);
  const [bounce, setBounce] = useState(40);
  const [toggle, setToggle] = useState(false);

  return (
    <ShowcaseSection id="voice-note" title={copy.title} description={copy.description} icon="microphone">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <div className="grid min-w-0 gap-3">
          <VoiceNote captureSource={captureSampleVoiceNote} interaction={toggle ? 'toggle' : 'hold'} bars={bars} sensitivity={sensitivity} bounce={bounce} />
          <p className="m-0 text-sm text-tertiary">{copy.sampleHint}</p>
        </div>
        <div className="grid min-w-0 gap-4">
          <Switch label={copy.toggleLabel} checked={toggle} onChange={(event) => setToggle(event.target.checked)} />
          <Slider label={copy.barsLabel} min={8} max={48} value={bars} onValueChange={setBars} showValue />
          <Slider label={copy.sensitivityLabel} value={sensitivity} onValueChange={setSensitivity} showValue />
          <Slider label={copy.bounceLabel} value={bounce} onValueChange={setBounce} showValue />
        </div>
      </div>
    </ShowcaseSection>
  );

}
