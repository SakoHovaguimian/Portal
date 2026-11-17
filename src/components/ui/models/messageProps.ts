import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { UiIntent } from './uiIntent';

export type MessageProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  title: string;
  description?: ReactNode;
  intent?: UiIntent;
  onDismiss?: () => void;
  action?: ReactNode;
};
