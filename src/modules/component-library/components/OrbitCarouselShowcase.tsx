'use client';

import { useState } from 'react';

import { OrbitCarousel, Slider } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { galleryCards } from './galleryCards';
import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.orbit;

export function OrbitCarouselShowcase() {

  const [float, setFloat] = useState(15);
  const [sink, setSink] = useState(50);
  const [settle, setSettle] = useState(50);
  const [spread, setSpread] = useState(100);
  const [depth, setDepth] = useState(100);

  return (
    <ShowcaseSection id="orbit-carousel" title={copy.title} description={copy.description} icon="image">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <OrbitCarousel className="mx-auto w-full max-w-lg" items={galleryCards} label={copy.title} float={float} sink={sink} settle={settle} spread={spread / 100} depth={depth} />
        <div className="grid min-w-0 gap-4">
          <Slider label={copy.floatLabel} value={float} onValueChange={setFloat} showValue />
          <Slider label={copy.sinkLabel} value={sink} onValueChange={setSink} showValue />
          <Slider label={copy.settleLabel} value={settle} onValueChange={setSettle} showValue />
          <Slider label={copy.spreadLabel} min={20} max={135} value={spread} onValueChange={setSpread} showValue />
          <Slider label={copy.depthLabel} max={150} value={depth} onValueChange={setDepth} showValue />
        </div>
      </div>
    </ShowcaseSection>
  );

}
