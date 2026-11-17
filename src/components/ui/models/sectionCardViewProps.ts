import type { ComponentProps, ReactNode } from 'react';

import type { Button } from '../components/Button';

export type SectionCardViewProps = Omit<ComponentProps<typeof Button>, 'title'> & {
  title: string;
  description?: string;
  icon: ReactNode;
  accent?: boolean;
  trailing?: ReactNode;
  metadata?: ReactNode;
};
