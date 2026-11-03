import type { ThemeId } from '@/models/themeId';
import type { ThemeMode } from '@/models/themeMode';
import { getTheme } from './catalog';
import { compileTheme, themeVariablesToStyle } from './compileTheme';

export { themeCatalog, themesById, getTheme } from './catalog';

export { compileTheme, themeVariablesToStyle } from './compileTheme';

export type { ThemeDefinition } from './models/themeDefinition';

export function getThemePreviewStyle(
  themeId: ThemeId,
  mode: ThemeMode = 'light',
) {

  return {
    ...themeVariablesToStyle(compileTheme(getTheme(themeId), mode)),
    colorScheme: mode,
  };

}
