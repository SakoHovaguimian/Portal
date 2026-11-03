import type { IconMenuItem } from './iconMenuItem';
import type { IconName } from './iconName';

export interface IconMenuProps<T extends string> {
  label: string;
  triggerLabel?: string;
  icon?: IconName;
  items: IconMenuItem<T>[];
  disabled?: boolean;
  className?: string;
  onAction?: (id: T) => void;
}
