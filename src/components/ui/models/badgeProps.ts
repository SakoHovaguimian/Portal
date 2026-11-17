import type { HTMLAttributes, ReactNode } from 'react';

import type { UiIntent } from './uiIntent';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  intent?: UiIntent | 'brand' | 'pink' | 'purple';
  dot?: boolean;
};
