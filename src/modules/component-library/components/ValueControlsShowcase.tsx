'use client';

import { strings } from '@/strings';
import { ProgressExamples } from './ProgressExamples';
import { SlidersExamples } from './SlidersExamples';
import { ShowcaseSection } from './ShowcaseSection';

export function ValueControlsShowcase() {
  return (
    <ShowcaseSection
      id="values"
      title={strings.valueControls.title}
      description={strings.valueControls.description}
      icon="settings"
    >
      <SlidersExamples />
      <ProgressExamples />
    </ShowcaseSection>
  );
}
