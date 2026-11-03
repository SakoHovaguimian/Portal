import type { ThemeId } from '@/models/themeId';
import type { ThemeDefinition } from './models/themeDefinition';
import { portalTheme } from './presets/portal';
import { studioTheme } from './presets/studio';
import { atelierTheme } from './presets/atelier';
import { blueprintTheme } from './presets/blueprint';
import { arcadeTheme } from './presets/arcade';
import { duskTheme } from './presets/dusk';
import { cupertinoTheme } from './presets/cupertino';

export const themesById = {
  portal: portalTheme,
  studio: studioTheme,
  atelier: atelierTheme,
  blueprint: blueprintTheme,
  arcade: arcadeTheme,
  dusk: duskTheme,
  cupertino: cupertinoTheme,
} satisfies Record<ThemeId, ThemeDefinition>;

export const themeCatalog: readonly ThemeDefinition[] =
  Object.values(themesById);

export function getTheme(id: ThemeId): ThemeDefinition {
  return themesById[id];
}
