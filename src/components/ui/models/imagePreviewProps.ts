import type { ReactNode, RefObject } from 'react';

import type { ImageMosaicItem } from './imageMosaicItem';

export interface ImagePreviewProps {
  image: ImageMosaicItem | null;
  open?: boolean;
  onClose: () => void;
  details?: ReactNode;
  actions?: ReactNode;
  fallbackFocus?: RefObject<HTMLElement | null>;
}
