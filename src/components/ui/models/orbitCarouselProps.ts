import type { MediaDeckProps } from './mediaDeckProps';

export interface OrbitCarouselProps extends MediaDeckProps {
  spread?: number;
  depth?: number;
  float?: number;
  sink?: number;
  settle?: number;
  showControls?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}
