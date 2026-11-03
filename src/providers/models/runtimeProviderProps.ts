import type { ChildrenProps } from '@/models/childrenProps';
import type { RuntimeConfig } from '@/models/runtimeConfig';

export interface RuntimeProviderProps extends ChildrenProps {
  config: RuntimeConfig;
}
