import type { IconName } from '@/components/ui';
import type { strings } from '@/strings';

export interface TileSpecimen {
  key: keyof typeof strings.componentLibrary.categoryLabels;
  icon: IconName;
  selected?: boolean;
  disabled?: boolean;
}
