import type { ComponentProps } from 'react';
import type Image from 'next/image';

export type BlogContentImageProps = ComponentProps<typeof Image> & {
  src: string;
};
