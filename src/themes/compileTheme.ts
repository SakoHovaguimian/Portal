import type { CSSProperties } from 'react';
import type { ThemeMode } from '@/models/themeMode';
import type { ThemeDefinition } from './models/themeDefinition';
import { semanticAliases, darkSemanticAliases } from './semanticAliases';

export type ThemeCssVariables = { [property: `--${string}`]: string };

/** Adapt complete semantic roles to Portal and Tailwind's existing vocabulary. */
export function compileThemeRoles(
  theme: ThemeDefinition,
  mode: ThemeMode,
): ThemeCssVariables {
  const dark = mode === 'dark';
  const background = theme.backgrounds[mode];
  const foreground = theme.foregrounds[mode];
  const palette = theme.palette[mode];
  const border = theme.border[mode];
  const shadow = theme.shadow[mode];
  const cssShadow = (value: string) =>
    value === 'none' ? '0 0 transparent' : value;
  const type = theme.typography;
  const spacing = theme.spacing;
  const radius = theme.radius;
  const motion = theme.motion;
  const selection = theme.selection[mode];
  const controls = theme.controls;
  const controlColors = controls?.colors[mode];
  const tokens: ThemeCssVariables = {
    '--color-surface': background.surface,
    '--color-body': background.canvas,
    '--color-primary': foreground.primary,
    '--color-secondary': foreground.secondary,
    '--color-text-tertiary': foreground.tertiary,
    '--color-text-quaternary': foreground.disabled,
    '--color-text-disabled': foreground.disabled,
    '--color-text-success-primary': palette.success,
    '--color-text-warning-primary': palette.warning,
    '--color-fg-success-primary': palette.success,
    '--color-fg-success-secondary': palette.success,
    '--color-fg-warning-primary': palette.warning,
    '--color-fg-warning-secondary': palette.warning,
    '--color-fg-error-secondary': palette.danger,
    '--color-bg-success-solid': palette.success,
    '--color-bg-warning-solid': palette.warning,
    '--color-bg-success-primary': `color-mix(in srgb, var(--color-success) 8%, var(--color-surface))`,
    '--color-bg-success-secondary': `color-mix(in srgb, var(--color-success) 16%, var(--color-surface))`,
    '--color-bg-warning-primary': `color-mix(in srgb, var(--color-warning) 8%, var(--color-surface))`,
    '--color-bg-warning-secondary': `color-mix(in srgb, var(--color-warning) 16%, var(--color-surface))`,
    '--color-bg-error-primary': `color-mix(in srgb, var(--color-error) 8%, var(--color-surface))`,
    '--color-bg-error-secondary': `color-mix(in srgb, var(--color-error) 16%, var(--color-surface))`,
    '--color-nav-item-button-icon-fg': foreground.secondary,
    '--color-nav-item-button-icon-fg_active': 'var(--color-accent)',
    '--color-nav-item-icon-fg': foreground.secondary,
    '--color-nav-item-icon-fg_active': 'var(--color-accent)',
    '--color-fg-disabled': foreground.disabled,
    '--color-fg-quaternary': foreground.tertiary,
    '--color-fg-quinary': foreground.disabled,
    '--color-bg-disabled': background.sunken,
    '--color-bg-disabled_subtle': background.canvas,
    '--color-bg-primary': background.surface,
    '--color-bg-primary-solid': background.inverse,
    '--color-bg-primary_alt': background.raised,
    '--color-bg-secondary': background.canvas,
    '--color-bg-secondary_alt': background.sunken,
    '--color-bg-secondary_subtle': background.canvas,
    '--color-bg-tertiary': background.sunken,
    '--color-bg-quaternary': background.sunken,
    '--color-bg-overlay': background.overlay,
    '--color-bg-primary_hover': 'var(--color-selection-hover)',
    '--color-bg-brand-primary': 'var(--color-selection-fill)',
    '--color-bg-brand-primary_alt': 'var(--color-selection-fill)',
    '--color-bg-brand-secondary':
      'color-mix(in srgb, var(--color-accent) var(--selection-emphasis-opacity), var(--color-surface))',
    '--color-border': border.color,
    '--color-control-border': border.control,
    '--color-border-secondary': border.subtle,
    '--color-border-tertiary': border.subtle,
    '--color-border-disabled': border.subtle,
    '--color-border-disabled_subtle': border.subtle,
    '--border-width-control': border.width,
    '--border-style-control': border.style,
    '--control-selected-border-width': border.selectedWidth,
    '--control-focus-outline-width': border.focusWidth,
    '--color-accent-light': theme.palette.light.accent,
    '--color-accent-dark': theme.palette.dark.accent,
    '--color-accent': palette.accent,
    '--color-on-accent': palette.onAccent,
    '--color-text-primary_on-brand': 'var(--color-on-accent)',
    '--color-text-secondary_on-brand': 'var(--color-on-accent)',
    '--color-text-tertiary_on-brand': 'var(--color-on-accent)',
    '--color-text-quaternary_on-brand': 'var(--color-on-accent)',
    '--color-button-primary-icon': 'var(--color-on-accent)',
    '--color-button-primary-icon_hover': 'var(--color-on-accent)',
    '--color-icon-fg-brand_on-brand': 'var(--color-on-accent)',
    '--color-error': palette.danger,
    '--color-success': palette.success,
    '--color-warning': palette.warning,
    '--color-info': palette.info,
    '--color-text-on-error': dark ? background.canvas : '#ffffff',
    '--color-bg-error-solid': palette.danger,
    '--color-soft-green': 'var(--color-selection-fill)',
    '--color-reference-green': 'var(--color-accent)',
    '--color-switch-thumb': dark ? foreground.primary : '#ffffff',
    '--color-switch-on': controlColors?.switchOn ?? palette.accent,
    '--color-control-track': controlColors?.track ?? background.sunken,
    '--color-control-thumb':
      controlColors?.thumb ?? (dark ? foreground.primary : '#ffffff'),
    '--color-control-thumb-border': controlColors?.thumbBorder ?? border.color,
    '--color-segmented-fill': controlColors?.segmentedFill ?? palette.accent,
    '--color-segmented-text': controlColors?.segmentedText ?? palette.onAccent,
    '--radius-track': controls?.trackRadius ?? radius.chip,
    '--radius-slider-thumb': controls?.sliderThumbRadius ?? radius.control,
    '--slider-thumb-width': controls?.sliderThumbWidth ?? '1.5rem',
    '--slider-thumb-height': controls?.sliderThumbHeight ?? '1.5rem',
    '--slider-track-height': controls?.sliderTrackHeight ?? '0.375rem',
    '--slider-vertical-length': controls?.sliderVerticalLength ?? '10rem',
    '--progress-track-height': controls?.progressTrackHeight ?? '0.5rem',
    '--progress-ring-stroke': controls?.progressRingStroke ?? '7',
    '--switch-width': controls?.switchWidth ?? '2.75rem',
    '--switch-height': controls?.switchHeight ?? '1.5rem',
    '--switch-inset': controls?.switchInset ?? '0.25rem',
    '--shadow-slider-thumb': cssShadow(
      controls?.shadow[mode] ?? shadow.control,
    ),
    '--font-ios-push': type.bodyFamily,
    '--font-body': type.bodyFamily,
    '--font-display': type.displayFamily,
    '--font-mono': type.monoFamily,
    '--font-weight-normal': String(type.normalWeight),
    '--font-weight-medium': String(type.mediumWeight),
    '--font-weight-semibold': String(type.headingWeight),
    '--font-weight-bold': String(type.boldWeight),
    '--heading-letter-spacing': type.headingTracking,
    '--text-xs': type.captionSize,
    '--text-xs--line-height': type.captionLeading,
    '--text-sm': type.controlSize,
    '--text-sm--line-height': type.controlLeading,
    '--text-base': type.bodySize,
    '--text-base--line-height': type.bodyLeading,
    '--text-md': type.bodySize,
    '--text-md--line-height': type.bodyLeading,
    '--text-lg': `calc(${type.bodySize} + 0.125rem)`,
    '--text-lg--line-height': type.bodyLeading,
    '--text-xl': `calc(${type.headingSize} * 0.75)`,
    '--text-xl--line-height': `calc(${type.headingLeading} * 0.8)`,
    '--text-2xl': `calc(${type.headingSize} * 0.875)`,
    '--text-2xl--line-height': `calc(${type.headingLeading} * 0.9)`,
    '--text-3xl': type.headingSize,
    '--text-3xl--line-height': type.headingLeading,
    '--text-4xl': `calc(${type.displaySize} * 0.77)`,
    '--text-4xl--line-height': `calc(${type.displayLeading} * 0.8)`,
    '--text-5xl': type.displaySize,
    '--text-5xl--line-height': type.displayLeading,
    '--text-display-md--letter-spacing': type.headingTracking,
    '--text-display-lg--letter-spacing': type.headingTracking,
    '--text-display-xl--letter-spacing': type.headingTracking,
    '--text-display-2xl--letter-spacing': type.headingTracking,
    '--text-display-xl': `calc(${type.displaySize} * 1.23)`,
    '--text-display-xl--line-height': `calc(${type.displayLeading} * 1.19)`,
    '--text-display-2xl': `calc(${type.displaySize} * 1.54)`,
    '--text-display-2xl--line-height': `calc(${type.displayLeading} * 1.5)`,
    '--radius-none': '0px',
    '--radius-xs': radius.small,
    '--radius-sm': radius.small,
    '--radius-DEFAULT': radius.control,
    '--radius-md': radius.control,
    '--radius-lg': radius.control,
    '--radius-xl': radius.card,
    '--radius-2xl': radius.overlay,
    '--radius-3xl': radius.sidebar,
    '--radius-full': '9999px',
    '--radius-control': radius.control,
    '--radius-card': radius.card,
    '--radius-overlay': radius.overlay,
    '--radius-chip': radius.chip,
    '--shadow-control': cssShadow(shadow.control),
    '--shadow-card': cssShadow(shadow.card),
    '--shadow-overlay': cssShadow(shadow.overlay),
    '--shadow-xs': cssShadow(shadow.control),
    '--shadow-sm': cssShadow(shadow.card),
    '--shadow-md': cssShadow(shadow.card),
    '--shadow-lg': cssShadow(shadow.overlay),
    '--shadow-xl': cssShadow(shadow.overlay),
    '--shadow-2xl': cssShadow(shadow.overlay),
    '--shadow-3xl': cssShadow(shadow.overlay),
    '--shadow-modern-mockup-inner-lg': cssShadow(shadow.inset),
    '--shadow-modern-mockup-inner-md': cssShadow(shadow.inset),
    '--shadow-modern-mockup-inner-sm': cssShadow(shadow.inset),
    '--shadow-modern-mockup-outer-lg': cssShadow(shadow.overlay),
    '--shadow-modern-mockup-outer-md': cssShadow(shadow.card),
    '--drop-shadow-iphone-mockup': cssShadow(shadow.illustration),
    '--shadow-skeumorphic': cssShadow(shadow.inset),
    '--shadow-xs-skeumorphic': cssShadow(shadow.control),
    '--spacing': spacing.unit,
    '--space-page': spacing.page,
    '--space-panel': spacing.panel,
    '--space-section': spacing.section,
    '--space-field': spacing.field,
    '--control-height-sm': spacing.controlSmall,
    '--control-height-md': spacing.controlMedium,
    '--control-height-lg': spacing.controlLarge,
    '--dashboard-sidebar-width': spacing.sidebarWidth,
    '--dashboard-sidebar-radius': radius.sidebar,
    '--dashboard-sidebar-item-radius': radius.control,
    '--dashboard-shell-bg': background.canvas,
    '--dashboard-shell-bg-emphasis': background.sunken,
    '--dashboard-shell-panel': background.surface,
    '--dashboard-shell-panel-solid': background.surface,
    '--dashboard-shell-topbar': background.raised,
    '--dashboard-shell-border': border.subtle,
    '--dashboard-shell-border-strong': border.color,
    '--dashboard-shell-overlay': background.overlay,
    '--dashboard-shell-shadow': cssShadow(shadow.card),
    '--dashboard-shell-shadow-lg': cssShadow(shadow.overlay),
    '--dashboard-sidebar-shadow': cssShadow(shadow.sidebar),
    '--color-nav-icon-bg': background.raised,
    '--ios-push-background': background.raised,
    '--ios-push-border': border.subtle,
    '--ios-push-text': foreground.primary,
    '--ios-push-secondary': foreground.secondary,
    '--ios-push-icon-background': 'var(--color-accent)',
    '--ios-push-icon-foreground': 'var(--color-on-accent)',
    '--ios-push-shadow': cssShadow(shadow.overlay),
    '--landing-background': background.surface,
    '--landing-foreground': foreground.primary,
    '--landing-green': 'var(--color-accent)',
    '--landing-green-hover': 'var(--color-bg-brand-solid_hover)',
    '--landing-on-accent': 'var(--color-on-accent)',
    '--landing-muted': foreground.secondary,
    '--landing-soft': background.canvas,
    '--landing-mint': 'var(--color-selection-fill)',
    '--landing-sage': 'var(--color-bg-brand-secondary)',
    '--landing-peach': background.sunken,
    '--landing-on-peach': foreground.primary,
    '--landing-forest': background.inverse,
    '--landing-on-dark': foreground.onInverse,
    '--landing-on-dark-muted': foreground.onInverse,
    '--landing-border': border.subtle,
    '--landing-shadow': cssShadow(shadow.card),
    '--landing-phone-shadow': cssShadow(shadow.overlay),
    '--motion-duration-press': `${motion.press}ms`,
    '--motion-duration-fast': `${motion.fast}ms`,
    '--motion-duration-base': `${motion.base}ms`,
    '--motion-duration-enter': `${motion.enter}ms`,
    '--motion-duration-celebration': `${motion.celebration}ms`,
    '--motion-ease-out': motion.ease,
    '--motion-ease-spring': motion.spring,
    '--motion-button-press-scale': String(motion.pressScale),
    '--motion-hover-scale': String(motion.hoverScale),
    '--motion-enter-scale': String(motion.enterScale),
    '--selection-fill-opacity': selection.fill,
    '--selection-emphasis-opacity': selection.emphasis,
    '--selection-hover-opacity': selection.hover,
    '--selection-border-opacity': selection.border,
  };
  // Neutral primitive utilities stay in the theme's material family in either mode.
  for (const [shade, amount] of [
    [25, 1],
    [50, 3],
    [100, 6],
    [200, 12],
    [300, 22],
    [400, 40],
    [500, 55],
    [600, 68],
    [700, 78],
    [800, 88],
    [900, 95],
    [950, 100],
  ]) {
    tokens[`--color-utility-gray-${shade}`] = `var(--color-gray-${shade})`;
    tokens[`--color-gray-${shade}`] =
      `color-mix(in srgb, var(--color-primary) ${amount}%, var(--color-surface))`;
  }
  return tokens;
}

/** Brand shades are derived from the selected theme's complete palette. */
function compileThemePalette(theme: ThemeDefinition): ThemeCssVariables {
  const tokens: ThemeCssVariables = {};
  for (const [shade, amount] of [
    [25, 3],
    [50, 6],
    [100, 12],
    [200, 22],
    [300, 38],
    [400, 58],
    [500, 78],
  ]) {
    tokens[`--color-brand-${shade}`] =
      `color-mix(in srgb, var(--color-accent-light) ${amount}%, white)`;
  }
  tokens['--color-brand-400'] = theme.palette.dark.accentBright;
  tokens['--color-brand-600'] = theme.palette.light.accent;
  tokens['--color-brand-700'] = theme.palette.light.accent;
  tokens['--color-brand-800'] = theme.palette.light.accent;
  tokens['--color-brand-900'] =
    'color-mix(in srgb, var(--color-accent-light) 78%, black)';
  tokens['--color-brand-950'] =
    'color-mix(in srgb, var(--color-accent-light) 55%, black)';
  return tokens;
}

export function compileTheme(
  theme: ThemeDefinition,
  mode: ThemeMode,
): ThemeCssVariables {
  return {
    ...semanticAliases,
    ...(mode === 'dark' ? darkSemanticAliases : {}),
    ...compileThemeRoles(theme, mode),
    ...compileThemePalette(theme),
  };
}

/** Repeat all aliases inside the preview scope; inherited resolved aliases cannot retint. */
export function themeVariablesToStyle(
  variables: ThemeCssVariables,
): CSSProperties {
  return {
    ...variables,
    fontFamily: 'var(--font-body)',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-body)',
    fontSize: 'var(--text-sm)',
    lineHeight: 'var(--text-sm--line-height)',
  } as CSSProperties;
}
