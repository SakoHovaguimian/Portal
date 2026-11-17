import type { ReactNode } from 'react';

export interface BulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  scope?: 'page' | 'all';
  onSelectAllResults?: () => void;
  onClear: () => void;
  busy?: boolean;
  children: ReactNode;
  error?: string;
}
