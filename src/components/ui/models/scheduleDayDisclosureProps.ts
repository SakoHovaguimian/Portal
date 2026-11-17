import type { ReactNode } from 'react';

export interface ScheduleDayDisclosureProps {
  day: string;
  wideTitle?: boolean;
  summary: ReactNode;
  expanded: boolean;
  disabled: boolean;
  invalid: boolean;
  onToggle: () => void;
  onEditFocus: () => void;
  children: ReactNode;
}
