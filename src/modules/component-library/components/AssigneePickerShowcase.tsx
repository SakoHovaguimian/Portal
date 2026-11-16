'use client';

import { useState } from 'react';

import { AssigneePicker, SegmentedTabs, Slider } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.assignees;
const rowLayout = 'row';
const gridLayout = 'grid';
const people = copy.sample.map((person, index) => ({
  id: String(index),
  name: person.name,
  description: person.role,
}));

export function AssigneePickerShowcase() {

  const [stack, setStack] = useState<'row' | 'grid'>('row');
  const [overlap, setOverlap] = useState(10);

  return (
    <ShowcaseSection id="assignee-picker" title={copy.title} description={copy.description} icon="user">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <div className="grid min-h-28 min-w-0 place-items-center rounded-card bg-secondary_subtle p-4">
          <AssigneePicker options={people} label={copy.title} stack={stack} overlap={overlap} defaultValue={['0', '1']} />
        </div>
        <div className="grid min-w-0 gap-4">
          <SegmentedTabs
            label={copy.layoutLabel}
            value={stack}
            onValueChange={setStack}
            tabs={[{ value: rowLayout, label: copy.rowOption }, { value: gridLayout, label: copy.gridOption }]}
          />
          <Slider label={copy.overlapLabel} max={22} value={overlap} onValueChange={setOverlap} showValue />
        </div>
      </div>
    </ShowcaseSection>
  );

}
