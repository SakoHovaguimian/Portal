# Loadable themes

Portal follows Rune's semantic theme-object pattern. A complete `ThemeDefinition` owns backgrounds, foregrounds, palette, radii, shadows, typography, spacing, borders, selection treatment, and motion. A component consumes roles; it never branches on a theme ID.

Open **Appearance** to select a theme. The component library uses the same controls and includes local specimens. Selecting a theme loads its signature palette and keeps the current light/dark mode. Each theme owns its complete palette; color is not a separate preference. Reduced motion always takes precedence over a theme's animation.

## Presets

| Theme       | Material And Geometry                                                                   | Type And Density                                  |
| ----------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Portal      | Familiar Aqua workspace, moderate corners, restrained elevation                         | IBM Plex Sans, comfortable rhythm                 |
| Studio      | Cool cobalt surfaces, larger rounded corners, soft elevation                            | Open spacing and generous controls                |
| Atelier     | Warm paper, small corners, flat ruled surfaces                                          | Serif headings and quiet motion                   |
| Blueprint   | Cool technical surfaces, square corners, flat outlines                                  | Monospace type and compact spacing                |
| Arcade      | Cream/plum surfaces, strong outlines, hard offset shadows                               | Bold headings and expressive presses              |
| Dusk        | Lavender/plum surfaces, rounded panels, tinted elevation                                | Balanced spacing and subdued movement             |
| macOS / iOS | Grouped neutral surfaces, blue actions, green switches, rounded tracks and white thumbs | Apple system font stacks and native-style density |

Every preset supplies light and dark backgrounds, foregrounds, palette, shadows, borders, and state opacity. Shape, type, rhythm, and motion remain consistent between its modes.

The `cupertino` preset adds the optional typed `controls` extension for slider/progress geometry, switch dimensions, thumb paint/elevation, and segmented selection colors. Existing presets derive those roles from their current semantic values. See [progress and value controls](VALUE_CONTROLS.md) for the API and runtime mapping. Themes never require a component to branch on their ID.

## Ownership

```text
src/themes/presets/*.ts + src/themes/models/*
  → compileTheme(themeObject, mode)
  → ThemeScript / ThemePreferenceProvider
  → --portal-* runtime values
  → src/app/theme.css semantic/Tailwind registrations
  → shared controls, shells, feature pages, and public pages
```

`src/themes/semanticAliases.ts` adapts the existing UI vocabulary and retains supporting primitive scales. Theme-specific appearance values belong in the preset objects, rather than in the adapter. `DESIGN.md` documents the accepted system; it does not generate a separate palette.

| Object Role                             | Runtime Roles                                                                     | Representative Consumers                                    |
| --------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `backgrounds`, `foregrounds`, `palette` | `--color-bg-*`, `--color-primary`, `--color-accent`, landing/shell aliases        | Pages, cards, text, buttons, notifications, public articles |
| `radius`                                | `--radius-control/card/overlay/chip`, existing `--radius-*` scale                 | Fields, buttons, cards, menus, dialogs, sidebar             |
| `shadow`                                | `--shadow-control/card/overlay`, existing shadow and shell aliases                | Controls, cards, popups, toasts, sidebar                    |
| `border`                                | `--border-width-control`, `--border-style-control`, border/focus/selection colors | Controls, table separators, surfaces, keyboard focus        |
| `typography`                            | `--font-body/display/mono`, `--text-*`, font weights/tracking                     | Body copy, titles, navigation, tables, code                 |
| `spacing`                               | `--spacing`, `--space-page/panel/section/field`, `--control-height-*`             | Tailwind rhythm, page composition, fields, shell            |
| `motion`                                | `--motion-duration-*`, easing and scale roles                                     | Presses, hover, selection, overlays, entrances              |
| `selection`                             | `--selection-*-opacity` → `--color-selection-*`                                   | Navigation, chips, tiles, listboxes, selected rows          |

True circular geometry such as radio marks, avatars, spinners, and unread dots remains circular. A functional disabled state or embedded table may deliberately suppress elevation. Those are component semantics, not alternate theme definitions.

## Load a registered theme

The provider uses the client-container preference service. Import the hook from the existing provider; do not create another preference store.

```tsx
const appearance = useThemePreference();

await appearance.setThemeId('blueprint');
await appearance.setPreference({ mode: 'dark' });
```

`setPreference` accepts a patch and preserves other properties. `setThemeId` applies the complete preset and preserves the current mode. Theme IDs are technical identifiers; all names, descriptions, and visible labels remain in `src/strings.ts`.

## Author a theme object

Start from a complete existing preset, give the new theme its own file, and use `satisfies ThemeDefinition` so missing roles fail TypeScript. Independent role types live in separate files under `src/themes/models`.

1. Add the ID to `src/models/themeId.ts`.
2. Create a complete object under `src/themes/presets/` and register it in `src/themes/catalog.ts`.
3. Add the name and description to `strings.designSystem.themeStudio.themes` in `src/strings.ts`.
4. Select it in Appearance. The picker, bootstrap, provider, and component library derive their options from the registry.
5. Run the project checks/build and inspect real pages, popups, keyboard focus, and narrow layouts in both modes. Use local demo data.

Responsive breakpoints remain build-time CSS constants because media queries cannot resolve runtime variables. The class-merging helper recognizes the registered `border-control` width and named radius roles, preserving strokes alongside border-color utilities.

No theme-specific stylesheet or screen variants are needed. Existing role values can change without touching `theme.css`. When introducing a genuinely new semantic role, add it to the role model, compiler, and `theme.css` utility registrations, then migrate its shared consumer.

The compiler also accepts a complete object directly for scoped previews or product-owned composition:

```tsx
import { compileTheme, getTheme, themeVariablesToStyle } from '@/themes';

const base = getTheme('studio');
const previewTheme = {
  ...base,
  radius: { ...base.radius, control: '0.25rem', card: '0.5rem' },
};
const previewStyle = themeVariablesToStyle(compileTheme(previewTheme, 'light'));
```

Use `getThemePreviewStyle(id, mode)` for registered previews. These helpers repeat the semantic aliases inside the preview scope, so a preview's background, border, type, and shadow resolve against its own values. Never set a few color variables on a child and assume already resolved inherited aliases will retint.

## Persistence and startup

Appearance stays in the existing `semantic-web-theme` storage key as `{themeId, mode}`. The bootstrap validates saved IDs and modes before content renders; the server fallback and provider use the same compiler. Invalid data falls back to Portal. Storage write failures leave the applied preference unchanged and produce the existing inline save error.

Old `{mode, accent}` records load as Portal and preserve light/dark mode. Obsolete accent overrides are ignored; the selected theme owns its colors. Changes synchronize across browser tabs through the existing storage event.

The Next font variables use `--font-portal-*` on the document root. Theme-owned `--font-body/display/mono` can therefore change without a font-loader class on the body overriding them. Browser theme switching makes no font-service, backend, Firebase, analytics, or notification calls.

## Avatar And Switch Shapes

`ThemeDefinition.radius.avatar` owns avatar corners, including image clipping and group overflow controls. `compileTheme` maps it through the prefixed runtime adapter to `--radius-avatar` / `rounded-avatar`. Every preset supplies this role; Blueprint uses zero, while Cupertino explicitly keeps circular avatars. Presence markers retain their circular semantic shape.

Optional `controls.switchTrackRadius` and `controls.switchThumbRadius` fall back to the theme's control and small radii. The compiler maps them to `--radius-switch-track` and `--radius-switch-thumb` through `theme.css`. Switch frames, checkbox input geometry, thumb, and interaction halo use the same roles. Cupertino supplies explicit pill/circle values. Avoid screen-local theme ID checks or hardcoded rounding.
