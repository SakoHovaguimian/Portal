import type { ReactNode } from 'react';
import type { UiIntent } from './uiIntent';

export interface IconTileProps {
  children: ReactNode;
  className?: string;
  intent?: UiIntent | 'brand';
  size?: 'sm' | 'md';
}
