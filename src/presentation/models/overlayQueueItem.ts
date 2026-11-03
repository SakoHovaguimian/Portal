import type { AlertQueueItem } from './alertQueueItem';
import type { SheetQueueItem } from './sheetQueueItem';
import type { ResolvedPresentationMotion } from './resolvedPresentationMotion';

export type OverlayQueueItem = (AlertQueueItem | SheetQueueItem) & { resolvedMotion: ResolvedPresentationMotion };
