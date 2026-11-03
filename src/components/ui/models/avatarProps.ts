import type { ControlSize } from './controlSize';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: ControlSize;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}
