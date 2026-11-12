import type { ReactNode } from 'react';

import type { ImageMosaicItem } from './imageMosaicItem';

export interface ImageMosaicProps<T extends ImageMosaicItem> {
  items: T[];
  label: string;
  disabled?: boolean;
  renderDetails?: (item: T, index: number) => ReactNode;
  renderActions?: (item: T, index: number) => ReactNode;
}
