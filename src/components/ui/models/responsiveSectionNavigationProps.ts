import type { SegmentedTabsProps } from './segmentedTabsProps';

export type ResponsiveSectionNavigationProps<T extends string> = SegmentedTabsProps<T> & { label: string };
