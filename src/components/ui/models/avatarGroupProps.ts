import type { AvatarProps } from './avatarProps';
import type { ControlSize } from './controlSize';

export interface AvatarGroupProps {
  label: string;
  items: readonly (AvatarProps & { id: string })[];
  max?: number;
  size?: ControlSize;
  className?: string;
}
