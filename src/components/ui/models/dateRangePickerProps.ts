import type { CalendarLabels } from './calendarLabels';
import type { DateRangeValue } from './dateRangeValue';

export interface DateRangePickerProps {
  label: string;
  value: DateRangeValue | null;
  onValueChange: (value: DateRangeValue | null) => void;
  startName?: string;
  endName?: string;
  min?: string;
  max?: string;
  locale?: string;
  calendarLabels?: CalendarLabels;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
}
