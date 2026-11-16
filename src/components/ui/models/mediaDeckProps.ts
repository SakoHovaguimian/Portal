import type { MediaCardItem } from './mediaCardItem';

export interface MediaDeckProps {
  items: readonly MediaCardItem[];
  label: string;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
  cardClassName?: string;
  disabled?: boolean;
}
