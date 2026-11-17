'use client';

import { useState } from 'react';

import { CardSwap, Slider, Switch } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { galleryCards } from './galleryCards';
import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.cardSwap;

export function CardSwapShowcase() {

  const [autoAdvance, setAutoAdvance] = useState(false);
  const [interval, setInterval] = useState(4.5);
  const [count, setCount] = useState(4);
  const [offset, setOffset] = useState(100);

  return (
    <ShowcaseSection id="card-swap" title={copy.title} description={copy.description} icon="layers">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <CardSwap
          label={copy.title}
          items={galleryCards}
          visibleCards={count}
          intervalMs={interval * 1000}
          autoAdvance={autoAdvance}
          offset={offset / 100}
          className="mx-auto max-w-sm"
        />
        <div className="grid min-w-0 gap-4">
          <Switch label={copy.autoLabel} checked={autoAdvance} onChange={(event) => setAutoAdvance(event.target.checked)} />
          <Slider label={copy.intervalLabel} min={1} max={12} step={0.5} value={interval} onValueChange={setInterval} formatOptions={{ style: 'unit', unit: 'second' }} showValue />
          <Slider label={copy.countLabel} min={1} max={galleryCards.length} value={count} onValueChange={setCount} showValue />
          <Slider label={copy.offsetLabel} min={0} max={150} value={offset} onValueChange={setOffset} showValue />
        </div>
      </div>
    </ShowcaseSection>
  );

}
