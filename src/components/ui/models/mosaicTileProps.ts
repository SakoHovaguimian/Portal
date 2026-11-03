import type { ImageMosaicItem } from './imageMosaicItem';

export interface MosaicTileProps {
  item: ImageMosaicItem;
  featured: boolean;
  paired: boolean;
  disabled?: boolean;
  onPreview: () => void;
}
