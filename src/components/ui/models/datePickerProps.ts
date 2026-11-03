import type { CalendarLabels } from './calendarLabels';

export interface DatePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  id?: string;
  min?: string;
  max?: string;
  locale?: string;
  calendarLabels?: CalendarLabels;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}
