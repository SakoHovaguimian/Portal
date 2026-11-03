import type { AlertQueueItem } from './alertQueueItem';
import type { SheetQueueItem } from './sheetQueueItem';

export type OverlayQueueConfig =
  Omit<AlertQueueItem, 'resolve'> | Omit<SheetQueueItem, 'resolve'>;
