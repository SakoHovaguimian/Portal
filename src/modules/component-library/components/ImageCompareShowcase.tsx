'use client';

import { useState } from 'react';

import { ImageCompare, Switch } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.compare;
const photo = '/component-library/alpine.webp';

export function ImageCompareShowcase() {

  const [labels, setLabels] = useState(true);
  const [elastic, setElastic] = useState(true);
  const [flick, setFlick] = useState(true);

  return (
    <ShowcaseSection id="image-compare" title={copy.title} description={copy.description} icon="image">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <ImageCompare
          label={copy.title}
          before={{ src: photo, alt: copy.beforeAlt, className: 'grayscale brightness-90' }}
          after={{ src: photo, alt: copy.afterAlt }}
          showLabels={labels}
          elastic={elastic}
          flickToEdge={flick}
          className="mx-auto w-full max-w-md"
        />
        <div className="grid gap-2">
          <Switch label={copy.labelsLabel} checked={labels} onChange={(event) => setLabels(event.target.checked)} />
          <Switch label={copy.elasticLabel} checked={elastic} onChange={(event) => setElastic(event.target.checked)} />
          <Switch label={copy.flickLabel} checked={flick} onChange={(event) => setFlick(event.target.checked)} />
        </div>
      </div>
    </ShowcaseSection>
  );

}
