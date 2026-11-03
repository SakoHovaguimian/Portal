# Progress and value controls

Import these shared components and their props from `@/components/ui`. Open `/dev-settings/components#values` to try them with local state. Select **macOS / iOS** in Appearance or in the library to apply the Cupertino preset. The preset changes existing controls as well as the new collection, and supports light and dark modes. Existing appearance defaults remain Portal.

## Collection

| Component           | Purpose                                      | Configuration                                                                                     |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Slider`            | Choose one value                             | Controlled/uncontrolled, min/max/step, endpoint icons, marks, horizontal/vertical, start/end fill |
| `RangeSlider`       | Choose an ordered minimum and maximum        | Two independently named thumbs, form field names, shared slider options                           |
| `NumberStepper`     | Enter an exact number or increment/decrement | Bounds, step, number formatting, required/read-only/disabled/invalid states                       |
| `ProgressBar`       | Show measurable or indeterminate work        | Min/max, custom value label, description, sizes, semantic tones                                   |
| `ProgressRing`      | Show work in a compact circular indicator    | Same value and formatting API as ProgressBar                                                      |
| `Meter`             | Show a measurement such as storage usage     | Min/max, number formatting, custom value label, sizes and tones                                   |
| `ActivityIndicator` | Indicate work with no measurable progress    | Accessible status label, optional visible label, sizes and tones                                  |
| `Skeleton`          | Reserve space while content loads            | Text/rectangle/circle, width/height, optional animation                                           |

Display copy, including labels, descriptions, validation and formatter output, belongs in `src/strings.ts`. Controls never persist values or initiate network requests. A consuming module owns validation, submission, cancellation, recovery, and permission checks.

## Slider API

Both sliders accept `label`, `description`, `errorMessage`, `min` (0), `max` (100), `step` (1), `size`, `tone`, `disabled`, `orientation`, `showValue`, `formatOptions`, `locale`, `marks`, and optional `leadingIcon`/`trailingIcon`. Values use the same units as the bounds and step. For percentage formatting, for example, use `max={1}`, `step={0.01}` and `formatOptions={{ style: 'percent' }}`. Icons are decorative; the label must explain the setting. `marks` are decorative scale positions and do not change the step.

`Slider` exchanges a number. `RangeSlider` exchanges `[minimum, maximum]` and prevents either thumb passing the other. Provide an ordered tuple within valid bounds. `value`/`onValueChange` support controlled use; `defaultValue` supports local state. `onValueCommit` fires after a pointer or keyboard adjustment ends, so consumers can defer expensive work. `name` on Slider and `names={[minimumName, maximumName]}` on RangeSlider participate in native form data. Optional `thumbLabels` replace the catalog's Minimum/Maximum accessible labels.

Arrow keys, Home/End, Page Up/Page Down, clicking the track, and touch/pointer dragging use React Aria's interaction owner. Each thumb has a 44px target and a separately visible focus ring. Disabled values cannot change. Invalid sliders associate their error text and set the native range input's invalid state. `fillFrom="end"` paints from the thumb to the maximum without reversing the value or keyboard semantics. Horizontal direction follows the locale; vertical sliders place the minimum at the bottom.

## Numbers and progress

`NumberStepper` uses `minValue`, `maxValue`, `step`, `value`/`defaultValue`, and `onValueChange`. It accepts `formatOptions` and `locale`, clamps on commit, and disables the appropriate step button at a boundary. Arrow keys provide the same increment/decrement action. Clearing the input emits `NaN`, following React Aria; the consuming form must treat that as empty and validate required values. `decrementLabel` and `incrementLabel` allow localized action names.

ProgressBar, ProgressRing, and Meter use `minValue`, `maxValue`, `value`, `valueLabel`, `formatOptions`, and `locale`. Descriptions are associated with their indicator. Use `indeterminate` only on the progress components when the amount of work is unknown; no numeric value is announced in that state. A meter represents a measurement and always has a numeric value. Tones communicate intent; use descriptive text for pause/error/success and offer retry/cancel actions in the owning flow. The library demonstrates an explicit local run/pause/interruption/retry workflow; its timers stop on unmount.

ActivityIndicator owns a labeled status region. Skeleton is decorative and hidden from assistive technology; its owning loading region supplies `aria-busy` and a meaningful loading label. Device and saved reduced-motion preferences stop movement while retaining visible indicators. Forced-colors styles preserve tracks, thumbs, and progress strokes.

## Theme ownership

`src/themes/presets/cupertino.ts` is a complete theme object. It uses Apple system font stacks (system fallbacks on other platforms), grouped neutral surfaces, blue actions, green switches, white slider thumbs, inset rounded tracks, and light/dark palettes. This is an authored web implementation of Apple-style controls; it does not load proprietary fonts, SF Symbols, or native OS widgets.

`ThemeDefinition.controls` is an optional, typed extension for component geometry and paint. Presets that omit it retain existing switch geometry and derive the new controls from their own radius, palette, surface, and shadow roles. The Cupertino preset supplies every control role. No consumer checks the theme ID.

| Theme role                                  | Runtime variables                                                                              | Consumers                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `controls.trackRadius`, `sliderThumbRadius` | `--radius-track`, `--radius-slider-thumb`                                                      | Sliders, progress bars, meters                    |
| Slider dimensions                           | `--slider-thumb-width/height`, `--slider-track-height`, `--slider-vertical-length`             | Slider/RangeSlider                                |
| Progress dimensions                         | `--progress-track-height`, `--progress-ring-stroke`                                            | ProgressBar/ProgressRing/Meter                    |
| Switch dimensions                           | `--switch-width/height/inset`                                                                  | Existing Switch                                   |
| `controls.colors[mode]`                     | `--color-control-track/thumb/thumb-border`, `--color-switch-on`, `--color-segmented-fill/text` | Sliders, indicators, switches, segmented controls |
| `controls.shadow[mode]`                     | `--shadow-slider-thumb`                                                                        | Slider thumbs                                     |

The existing path remains preset → compiler → ThemeScript/provider → `theme.css` → shared consumer. Per-instance sizes scale the theme's base dimensions; tones select semantic palette roles. Use a complete custom object with `compileTheme` for scoped product previews, as described in [the theme guide](THEMING.md). Keep behavior, target size, and focus semantics independent of appearance.

The visual reference is Apple's [slider guidance](https://developer.apple.com/design/human-interface-guidelines/sliders) and [progress indicator guidance](https://developer.apple.com/design/human-interface-guidelines/progress-indicators).
