import type { AppearancePreference } from '@/models/appearancePreference';
import { getTheme } from './catalog';
import { compileTheme } from './compileTheme';

export function applyTheme(value: AppearancePreference) {
  const root = document.documentElement;
  const variables = compileTheme(getTheme(value.themeId), value.mode);
  for (const [property, token] of Object.entries(variables)) {
    root.style.setProperty(`--portal-${property.slice(2)}`, token);
  }
  root.style.colorScheme = value.mode;
  root.classList.toggle('dark-mode', value.mode === 'dark');
  root.dataset.theme = value.mode;
  root.dataset.themeId = value.themeId;
}
