import type { ImageProps } from 'next/image';

export type ComparisonImage = Pick<ImageProps, 'src' | 'alt'> & {
  label?: string;
  className?: string;
};
