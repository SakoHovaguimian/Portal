import type { ThemeMode } from '@astryxdesign/core/theme'

export const ThemeModeStorageKey = 'portal-theme-mode'
export const ThemeModeCookieName = 'portal-theme-mode'
export const ThemeModeBootstrapAttribute = 'data-initial-theme'

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

export const themeModeBootstrapScript = `
(() => {
  try {
    const root = document.documentElement;
    const serverMode = root.getAttribute('data-theme');
    const storedMode = window.localStorage.getItem('${ThemeModeStorageKey}');
    const mode = serverMode === 'light' || serverMode === 'dark'
      ? serverMode
      : storedMode === 'light' || storedMode === 'dark' || storedMode === 'system'
        ? storedMode
        : 'system';

    window.localStorage.setItem('${ThemeModeStorageKey}', mode);
    document.cookie = '${ThemeModeCookieName}=' + mode + '; Path=/; Max-Age=31536000; SameSite=Lax';

    if (mode === 'light' || mode === 'dark') {
      root.setAttribute('data-theme', mode);
      root.setAttribute('${ThemeModeBootstrapAttribute}', mode);
    } else {
      root.removeAttribute('data-theme');
      root.removeAttribute('${ThemeModeBootstrapAttribute}');
    }
  } catch {}
})();
`
