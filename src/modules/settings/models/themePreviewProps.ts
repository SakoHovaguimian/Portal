import type { ThemeMode } from '@/models/appearance';
import type { ThemeId } from '@/models/themeId';

export type ThemePreviewProps = {
  themeId: ThemeId;
  mode: ThemeMode;
};
