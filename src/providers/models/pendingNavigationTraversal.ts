import type { NavigationHistoryEntry } from './navigationHistoryEntry';

export interface PendingNavigationTraversal {
  from: NavigationHistoryEntry;
  delta: number;
  permission: boolean | Promise<boolean>;
  deciding: boolean;
}
