import type { ChildrenProps } from '@/models/childrenProps';
import type { AppSession } from '@/models/appSession';

export interface AppProvidersProps extends ChildrenProps {
  session: AppSession | null;
}
