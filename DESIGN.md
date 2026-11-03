---
version: alpha
name: Portal
description: A readable operational workbench with seven loadable semantic theme objects and shared accessible controls.
colors:
  surface: '#ffffff'
  background: '#f3f7f7'
  text: '#17252b'
  muted: '#52636b'
  border: '#dfe7e9'
  primary: '#17665f'
typography:
  sans:
    fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
    fontSize: '1.125rem'
    lineHeight: '1.75rem'
  mono:
    fontFamily: 'IBM Plex Mono, ui-monospace, monospace'
rounded:
  DEFAULT: '0.625rem'
  card: '0.875rem'
spacing:
  panel: '1.5rem'
  field-gap: '1rem'
components:
  button:
    rounded: '0.625rem'
  card:
    rounded: '0.875rem'
  input:
    rounded: '0.625rem'
  dialog:
    rounded: '1.25rem'
---

# Portal design context

## Overview

Portal is an English-language starter for operators managing people, requests, and conversations. The reusable LeafLaunch Web foundation is part of every new project: shared controls, page patterns, mobile navigation, motion, and theming. Product register governs the authenticated application. `/dev-settings/components` is the protected, local component library; `/experience` remains the optional immersive showcase. Neither preview promises live business integrations.

Portal's baseline is a readable Aqua operational workbench. The application also supports complete Studio, Atelier, Blueprint, Arcade, and Dusk identities: rounded elevated surfaces, warm serif paper, square technical density, outlined offset depth, and plum-tinted elevation respectively. Selecting a theme changes shape, depth, type, rhythm, color, and motion through the same components. Preserve the existing route and interaction system; theme selection changes visual roles. Existing saved modes remain valid; themes now own their complete palette. Avoid decorative nested cards and marketing effects in routine data entry.

The seventh identity, macOS / iOS (`cupertino`), brings familiar Apple control styling: grouped gray surfaces, system typography, blue actions, green switches, raised white slider thumbs, and neutral segmented selection. It is a selectable theme; the existing Portal default is retained. Native operating-system proportions guide the details while shared keyboard, focus, and target-size contracts remain intact.

Typed runtime theme objects are canonical (ownership model B). `src/themes/presets/*.ts` implements the complete `ThemeDefinition` contract, with independent role models under `src/themes/models`. `compileTheme` adapts each object into semantic values; ThemeScript and ThemePreferenceProvider apply them through the `--portal-*` variables registered in `src/app/theme.css`. The CSS file registers Tailwind utilities and shared behavior; it does not maintain a second palette. `globals.css` imports focused behavior styles. This document mirrors the Portal preset and describes the system. See [loadable themes](docs/THEMING.md) for the full ownership path and extension workflow.

## Colors

The Portal preset uses the exact light surface/background/text/muted/border values above and an Aqua action (#17665f). Its dark mode uses #10181c canvas, #172227 panels, and lighter text. Every theme supplies its own light/dark background, foreground, status, and default accent roles. Selecting a theme applies its complete palette. Color is not a separate preference; saved legacy accent overrides are ignored.

Selection fill mixes the theme’s action color into the current surface: 7% in light mode and 12% in dark mode. Emphasized surfaces use 12%/20%; hover uses 5%/8%; soft selected borders use 50%/55%. These Portal baseline percentages belong to its theme object; other themes can set their own state opacity. Tiles, chips, section cards, sidebar selection, and listbox options share these roles. Never mix an optional accent into a fixed mint background. Focus rings and filled checkbox/radio/switch frames retain strong semantic strokes. Success, warning, and danger remain independent of brand choice.

## Typography

Actions, titles, field labels, navigation, table headers, options, and short statuses use Title Case (every word capitalized); descriptions and validation use sentence case. Follow [copy casing](docs/STRINGS.md#copy-casing), including preserved acronyms and brand spelling.

The Portal baseline uses IBM Plex Sans for body/headings and IBM Plex Mono for technical values. Body: 18px/28px; controls/navigation/table values: 16px/24px; captions/badges/table headers: 14px/20px. Typography roles also own weights, leading, and heading tracking. Atelier uses serif headings; Blueprint uses monospace throughout. Next font source variables live on html as --font-portal-* so they never override loaded semantic font roles on body. Use rem-based named utilities, allow labels to wrap, and keep root font size independent of spacing. All authored display copy belongs in src/strings.ts.

## Layout

AppShell owns a theme-sized sidebar (17rem in Portal) at 64rem and above. Short screens scroll the sidebar without trapping the document. Below 64rem, a full-screen Radix navigation menu supplies the same destinations, account block, focus trap, Escape, and safe-area padding. The header shows workspace context and theme control. Screens own their PageHeader h1; the component specimen uses a lower heading level.

Page → PageHeader → content. Directories use DataPanel and DataTable; mobile summaries use MobileRecordRow below 48rem. Tables without summaries keep a labeled, focusable horizontal scroller. Settings use SectionStack/SplitSection; explicit actions use FormActions, with sticky actions only on spacious desktop. Document scrolling remains natural for forms and inactive panels remain mounted for drafts.

Component-library navigation uses one scroll legend. It stays to the left on desktop and becomes a wrapping list at compact widths. There is no second section dropdown.

## Elevation & Depth

The loaded object owns border width/style, surface contrast, and control/card/overlay/sidebar/inset shadows. Portal uses restrained elevation; Studio uses soft depth; Atelier and Blueprint use flat surfaces; Arcade uses hard offsets; Dusk uses tinted elevation. Primary actions and section previews derive their treatments from semantic roles. Avoid per-screen shadow constants. Flat shadow roles compile to transparent zero shadows so Tailwind focus rings remain valid.

## Shapes

Portal control corners use 10px, cards 14px, dialogs 20px, and sidebar 24px. These are the baseline object values; every preset supplies its own control/card/overlay/chip/sidebar roles. Blueprint makes these square, while Studio increases rounding. Avatars, radio marks, unread dots, and spinners retain functional circular geometry. Selected strokes are inset so state changes preserve geometry. Busy buttons preserve their labels' footprint and accessible name. Overlays stay inside dynamic viewport and safe-area bounds.

## Components

`src/components/ui` and its barrel own reusable primitives. See [UI system](docs/UI_SYSTEM.md) for the inventory and extension workflow. Domain services stay in modules; shared controls receive data and callbacks. DatePicker, Accordion, rating/summary, save/reaction controls, native horizontal carousel, auto-growing text, typed HEX editing and content transitions extend this same foundation. Ratings derive their semantic active/inactive/surface roles from the theme’s action and text tokens; no product-specific palette is imported. Assistant/media components never acquire LeafLaunch backend dependencies.

Progress bars/rings, single and dual-thumb sliders, exact numeric steppers, meters, activity indicators, and skeletons share theme-owned component roles. `ThemeDefinition.controls` → compiler → `theme.css` maps track/thumb corners and dimensions, control colors, switch geometry, segmented colors, and thumb shadows. The optional extension derives defaults from existing roles when absent, preserving older presets. Component sizes scale those bases; functional circles and 44px interaction targets remain semantic geometry. See [value controls](docs/VALUE_CONTROLS.md) for the full mapping and APIs.

| Role                  | Canonical runtime path                                                           | Consumers                                                 |
| --------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Palette and surface   | ThemeDefinition → compileTheme → --color-accent / --color-surface / --color-bg-* | all shared UI                                             |
| Selection alpha       | `--selection-*-opacity` → `--color-selection-*`                                  | tiles, chips, listboxes, section cards, navigation        |
| Typography and shapes | ThemeDefinition → compileTheme → --text-* / --radius-*                           | controls, pages, tables                                   |
| Theme preference      | appearancePreference → service/container → ThemePreferenceProvider + ThemeScript | shell, Appearance, library                                |
| Motion preference     | motionPreference → service/container → MotionPreferenceProvider + ThemeScript    | CSS and JavaScript motion                                 |
| Interaction timing    | --motion-duration-press/fast/base/enter + shared styles                          | controls, segmented indicators, list reordering, overlays |
| Overlays              | PresentationProvider + Modal/Sheet/ImagePreview                                  | application and previews                                  |
| Scrollbars            | globals.css, semantic colors, forced-colors fallback                             | every product-owned scroller                              |

Portal baseline motion is 90ms for presses, 140ms for feedback, 200ms for settled selection, 240ms for entrances, and 440ms for celebration. Every theme supplies duration, easing, press, hover, and entrance-scale roles. Presentation overlays inherit these values unless a caller explicitly requests a preview override. Segmented indicators measure real label geometry after layout and resize, with a first-render fallback. More than two choices use Select below 600px; two choices retain their capsule. Panels stay mounted and inactive panels are hidden/inert. Reordered lists use shared FLIP motion and keyboard move controls, keeping focus with the moved handle. Committed route/tab/filter choices push URL history; presentation motion never alters native Back/Forward semantics. Device reduced motion and the saved Reduced choice both disable movement without changing state or dialog placement.

Stepper defaults to LeafLaunch's horizontal segmented bars with numbered/check markers. `orientation="vertical"` uses connected stacked stages; `orientation="responsive"` switches by container width at 34rem. Labels wrap in compact horizontal examples. Eligibility and progression belong to the caller, never the display component.

## Do's and Don'ts

Reuse shared components, semantic tokens, motion helpers, and presentation ownership. Check mobile, keyboard, dark/light themes, and reduced motion after system changes. Keep demo previews local. Do not add browser authentication, auth-token storage, new string catalogs, fixed feature palettes, or equivalent screen-local controls.
