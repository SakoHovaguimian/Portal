import type { RefObject } from 'react';
import type { ScheduleWindow } from './scheduleWindow';

export interface ScheduleWindowFieldsProps {
  window: ScheduleWindow;
  label: string;
  prefix: string;
  invalid: Record<string, string>;
  fields: RefObject<Map<string, HTMLElement>>;
  onChange: (key: keyof ScheduleWindow, value: string | null) => void;
  onRemove?: () => void;
  removeLabel: string;
  compact?: boolean;
}
