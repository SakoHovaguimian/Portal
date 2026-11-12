import Image from 'next/image';

import type { BlogContentImageProps } from '../models/blogContentImageProps';

export function BlogContentImage({
  alt,
  ...props
}: BlogContentImageProps) {
  return <Image {...props} alt={alt} />;
}
