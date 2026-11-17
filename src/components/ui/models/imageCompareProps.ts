import type { ComparisonImage } from './comparisonImage';

export interface ImageCompareProps {
  before: ComparisonImage;
  after: ComparisonImage;
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (position: number) => void;
  onValueCommit?: (position: number) => void;
  showLabels?: boolean;
  elastic?: boolean;
  flickToEdge?: boolean;
  step?: number;
  aspectRatio?: number;
  sizes?: string;
  disabled?: boolean;
  className?: string;
}
