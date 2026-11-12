import type { AppSession } from '@/models/appSession';
import type { ChildrenProps } from '@/models/childrenProps';

export interface AppProvidersProps extends ChildrenProps {
  session: AppSession | null;
}
