import type { MediaDeckProps } from './mediaDeckProps';

export interface CardSwapProps extends MediaDeckProps {
  autoAdvance?: boolean;
  intervalMs?: number;
  visibleCards?: number;
  offset?: number;
  rotation?: number;
}
