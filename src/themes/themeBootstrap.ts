import {
  ThemeIdSchema,
  defaultAppearancePreference,
} from '@/models/appearance';
import { themeCatalog, getTheme } from './catalog';
import { compileTheme, type ThemeCssVariables } from './compileTheme';
import { semanticAliases } from './semanticAliases';

let defaultThemeCss: string | undefined;
let themeBootstrapScript: string | undefined;

function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/** The server fallback and pre-hydration bootstrap share the runtime compiler. */
export function getDefaultThemeCss(): string {

  if (defaultThemeCss !== undefined) { return defaultThemeCss; }
  const tokens = compileTheme(
    getTheme(defaultAppearancePreference.themeId),
    defaultAppearancePreference.mode,
  );
  const declarations = Object.entries(tokens)
    .map(([name, value]) => `--portal-${name.slice(2)}:${value}`)
    .join(';');
  defaultThemeCss = `:root{${declarations};color-scheme:${defaultAppearancePreference.mode}}`;
  return defaultThemeCss;

}

export function getThemeBootstrapScript(): string {

  if (themeBootstrapScript !== undefined) { return themeBootstrapScript; }
  // Send compatibility aliases once; mode/preset tables contain only their differences.
  const variants = Object.fromEntries(
    themeCatalog.map((theme) => {

      const themeVariant = [
        theme.id,
        Object.fromEntries(
          (['light', 'dark'] as const).map((mode) => {

            const modeVariant = [
              mode,
              Object.fromEntries(
                Object.entries(compileTheme(theme, mode)).filter(
                  ([key, value]) =>
                    semanticAliases[key as keyof typeof semanticAliases] !== value,
                ),
              ),
            ];

            return modeVariant;

          }),
        ),
      ];

      return themeVariant;

    }),
  );
  const base: ThemeCssVariables = semanticAliases;
  themeBootstrapScript = `(function () {

  var root = document.documentElement;
  var fallback = ${serialize(defaultAppearancePreference)};
  var themes = ${serialize(ThemeIdSchema.options)};
  var value;
  try {

    value = JSON.parse(localStorage.getItem('semantic-web-theme') || 'null');
    if (!value || !['light', 'dark'].includes(value.mode) || ('themeId' in value && !themes.includes(value.themeId))) {
      value = fallback;
    } else {
      value = { themeId: value.themeId || 'portal', mode: value.mode };
    }

  } catch (error) {
    value = fallback;
  }
  var variants = ${serialize(variants)};
  var tokens = Object.assign({}, ${serialize(base)}, variants[value.themeId][value.mode]);
  Object.keys(tokens).forEach(function (key) {
    root.style.setProperty('--portal-' + key.slice(2), tokens[key]);
  });
  root.style.colorScheme = value.mode;
  root.classList.toggle('dark-mode', value.mode === 'dark');
  root.dataset.theme = value.mode;
  root.dataset.themeId = value.themeId;
  try {
    root.dataset.motion = localStorage.getItem('portal-motion') === '"reduced"' ? 'reduced' : 'system';
  } catch (error) {
    root.dataset.motion = 'system';
  }

})();`;
  return themeBootstrapScript;

}
