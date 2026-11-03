'use client';

import type { ResponsiveSectionNavigationProps } from '../models/responsiveSectionNavigationProps';
import { SegmentedTabs } from './Tabs';

// Section destinations and ordinary segmented controls share one responsive rule.
export function ResponsiveSectionNavigation<T extends string>(
  props: ResponsiveSectionNavigationProps<T>,
) {
  return <SegmentedTabs {...props} />;
}
