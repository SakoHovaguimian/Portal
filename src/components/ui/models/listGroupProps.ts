import type { ReactNode, Ref } from 'react';

export interface ListGroupProps {
  children: ReactNode;
  ordered?: boolean;
  label?: string;
  listRef?: Ref<HTMLOListElement>;
  className?: string;
}
