import type { ReactNode } from 'react';

export interface ReorderableListProps<T extends { id: string }> {
  variant?: 'list' | 'cards';
  items: T[];
  disabled: boolean;
  label: string;
  handleLabel: (item: T) => string;
  upLabel: (item: T) => string;
  downLabel: (item: T) => string;
  onMove: (id: string, targetId: string) => void;
  renderItem: (
    item: T,
    index: number,
    controls: ReactNode,
    handle: ReactNode,
  ) => ReactNode;
}
