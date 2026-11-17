import type { ComponentProps } from 'react';

import type { Button } from '../components/Button';

export type BookmarkButtonProps = Omit<
  ComponentProps<typeof Button>,
  'asChild'
> & {
  saved?: boolean;
  savedLabel?: string;
};
