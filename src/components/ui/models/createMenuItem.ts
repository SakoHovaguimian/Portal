import type { IconName } from './iconName';

export interface CreateMenuItem<Value extends string> {
  id: Value;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}
