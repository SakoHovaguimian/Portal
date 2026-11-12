import type { ChildrenProps } from '@/models/childrenProps';

import type { ThemePreferenceService } from '@/modules/settings/services/themePreferenceService';

export interface ThemePreferenceProviderProps extends ChildrenProps {
  service: ThemePreferenceService;
}
