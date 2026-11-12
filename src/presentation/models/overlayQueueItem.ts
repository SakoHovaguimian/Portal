import type { AlertQueueItem } from './alertQueueItem';
import type { ResolvedPresentationMotion } from './resolvedPresentationMotion';
import type { SheetQueueItem } from './sheetQueueItem';

export type OverlayQueueItem = (AlertQueueItem | SheetQueueItem) & { resolvedMotion: ResolvedPresentationMotion };
