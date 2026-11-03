import type { ControlSize } from './controlSize';
import type { ControlTone } from './controlTone';

export interface ActivityIndicatorProps {
  label: string;
  size?: ControlSize;
  tone?: ControlTone;
  showLabel?: boolean;
  className?: string;
}
