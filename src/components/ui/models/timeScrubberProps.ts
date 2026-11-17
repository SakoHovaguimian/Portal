export interface TimeScrubberProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (minutes: number) => void;
  stepMinutes?: number;
  hourCycle?: 12 | 24;
  locale?: string;
  momentum?: number;
  name?: string;
  disabled?: boolean;
  className?: string;
}
