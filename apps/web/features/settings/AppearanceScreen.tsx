'use client';

import { AccentThemeSchema } from '@semantic-web/core';
import { Button, Card } from '@semantic-web/ui';
import { useThemePreference } from '../../providers/AppProviders';

const accentPreview: Record<string, string> = {
  aqua: 'from-cyan-300 to-teal-500',
  blue: 'from-sky-400 to-blue-600',
  indigo: 'from-indigo-300 to-indigo-600',
  mint: 'from-emerald-300 to-emerald-600',
  salmon: 'from-rose-300 to-rose-600',
  violet: 'from-violet-300 to-violet-600',
  amber: 'from-amber-300 to-orange-500',
  teal: 'from-teal-300 to-teal-600',
  rose: 'from-pink-300 to-rose-600',
  sky: 'from-sky-300 to-cyan-600',
  emerald: 'from-emerald-300 to-green-600',
  seafoam: 'from-teal-200 to-emerald-500',
  coral: 'from-orange-300 to-red-500',
  sunset: 'from-yellow-300 to-orange-500',
  orchid: 'from-fuchsia-300 to-violet-600',
};

export function AppearanceScreen() {
  const { mode, accent, setPreference } = useThemePreference();

  return (
    <Card className="grid gap-6">
      <div className="grid gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Appearance Studio</p>
        <h2 className="m-0 text-3xl font-semibold tracking-tight text-primary">Tune light/dark and brand accents from semantic tokens.</h2>
        <p className="m-0 max-w-3xl text-sm leading-6 text-secondary">
          This starter now includes expanded Glow-inspired accents and a softer charcoal dark mode.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => void setPreference({ mode: 'light', accent })}
          className={`rounded-3xl border p-4 text-left transition ${
            mode === 'light'
              ? 'border-brand bg-brand-primary/25 shadow-xs'
              : 'border-secondary bg-secondary_subtle hover:border-primary'
          }`}
        >
          <div className="text-sm font-semibold text-primary">Light</div>
          <p className="mt-1 m-0 text-sm text-secondary">Bright surfaces with soft teal-gray depth.</p>
        </button>
        <button
          type="button"
          onClick={() => void setPreference({ mode: 'dark', accent })}
          className={`rounded-3xl border p-4 text-left transition ${
            mode === 'dark'
              ? 'border-brand bg-brand-primary/25 shadow-xs'
              : 'border-secondary bg-secondary_subtle hover:border-primary'
          }`}
        >
          <div className="text-sm font-semibold text-primary">Dark</div>
          <p className="mt-1 m-0 text-sm text-secondary">Charcoal-first palette with cleaner contrast.</p>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {AccentThemeSchema.options.map((option) => {
          const active = accent === option;
          const swatchClass = accentPreview[option] ?? 'from-gray-300 to-gray-500';

          return (
            <button
              key={option}
              type="button"
              onClick={() => void setPreference({ mode, accent: option })}
              className={`rounded-3xl border p-4 text-left transition ${
                active
                  ? 'border-brand bg-brand-primary/25 shadow-xs'
                  : 'border-secondary bg-primary hover:border-primary hover:bg-secondary_subtle'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold capitalize text-primary">{option}</span>
                <span className={`h-5 w-10 rounded-full bg-linear-to-r ${swatchClass}`} />
              </div>
              <p className="mt-2 m-0 text-xs uppercase tracking-[0.12em] text-tertiary">
                {active ? 'Active accent' : 'Set accent'}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant={mode === 'light' ? 'primary' : 'secondary'} onClick={() => void setPreference({ mode: 'light', accent })}>
          Light
        </Button>
        <Button variant={mode === 'dark' ? 'primary' : 'secondary'} onClick={() => void setPreference({ mode: 'dark', accent })}>
          Dark
        </Button>
      </div>
    </Card>
  );
}
