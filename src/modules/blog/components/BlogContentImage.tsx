import Image from 'next/image';
import type { ComponentProps } from 'react';
export function BlogContentImage({
  alt,
  ...props
}: ComponentProps<typeof Image> & { src: string }) {
  return <Image {...props} alt={alt} />;
}
