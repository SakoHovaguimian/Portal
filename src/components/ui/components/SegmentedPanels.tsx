'use client';

import type { SegmentedPanelsProps } from '../models/segmentedPanelsProps';
import { useId } from 'react';
import { ResponsiveSectionNavigation } from './ResponsiveSectionNavigation';

export function SegmentedPanels<T extends string>({
  panels,
  value,
  onValueChange,
  label,
  disabled = false,
}: SegmentedPanelsProps<T>) {

  const id = useId();
  const navigationTabs = panels.map(({ value, label, meta }) => ({
    value,
    label,
    meta,
    panelId: `${id}-${value}`,
  }));

  function renderPanel(panel: (typeof panels)[number]) {

    return (
      <div
        key={panel.value}
        id={`${id}-${panel.value}`}
        role="group"
        aria-label={panel.label}
        hidden={value !== panel.value}
        inert={value !== panel.value}
        className="min-w-0"
      >
        {panel.content}
      </div>
    );

  }

  const panelElements = panels.map(renderPanel);

  return (
    <div className="grid min-w-0 gap-8">
      <ResponsiveSectionNavigation
        tabs={navigationTabs}
        value={value}
        onValueChange={onValueChange}
        label={label}
        disabled={disabled}
      />
      {panelElements}
    </div>
  );

}
