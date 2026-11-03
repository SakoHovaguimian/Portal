import type { AlertQueueItem } from './alertQueueItem';
import type { SheetQueueItem } from './sheetQueueItem';

export type OverlayQueueItem = AlertQueueItem | SheetQueueItem;
