import type { ReactNode } from 'react';

import type { AppSession } from '@/models';

export interface ProtectedShellProps {
  children: ReactNode;
  initialSession: AppSession;
}
