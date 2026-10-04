'use client';
import { labels } from '@/strings/labels';
import { strings } from '@/strings';
import { NotificationControls } from '@/services/notifications/components/NotificationControls';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';

import { AccentThemeSchema } from '@/models';
import { Button, Card } from '@/components/ui';
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
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          {strings.ui.appearanceScreen.appearance}
        </p>
        <h2 className="m-0 text-3xl font-semibold tracking-tight text-primary">
          {
            strings.ui.appearanceScreen
              .tuneLightDarkAndAccentBehaviorFromOneToken
          }
        </h2>
        <p className="m-0 max-w-3xl text-sm leading-6 text-secondary">
          {
            strings.ui.appearanceScreen
              .neutralGraysAndWhitesCarryTheLayoutWhileThe
          }
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => void setPreference({ mode: 'light', accent })}
          className={`rounded-2xl border p-5 text-left transition ${
            mode === 'light'
              ? 'border-brand bg-brand-primary shadow-[var(--dashboard-shell-shadow)]'
              : 'border-secondary bg-secondary_subtle hover:border-primary'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-primary">
              {strings.ui.appearanceScreen.light}
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-white ring-1 ring-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-100 ring-1 ring-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-300 ring-1 ring-slate-300" />
            </div>
          </div>
          <p className="mt-2 m-0 text-sm text-secondary">
            {
              strings.ui.appearanceScreen
                .brightShellBackgroundWhiteCardsAndSoftGraySeparators
            }
          </p>
        </button>
        <button
          type="button"
          onClick={() => void setPreference({ mode: 'dark', accent })}
          className={`rounded-2xl border p-5 text-left transition ${
            mode === 'dark'
              ? 'border-brand bg-brand-primary shadow-[var(--dashboard-shell-shadow)]'
              : 'border-secondary bg-secondary_subtle hover:border-primary'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-primary">
              {strings.ui.appearanceScreen.dark}
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-slate-950 ring-1 ring-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-800 ring-1 ring-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-600 ring-1 ring-slate-600" />
            </div>
          </div>
          <p className="mt-2 m-0 text-sm text-secondary">
            {
              strings.ui.appearanceScreen
                .deepSlateShellElevatedPanelsAndRestrainedContrastThat
            }
          </p>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {AccentThemeSchema.options.map((option) => {
          const active = accent === option;
          const swatchClass =
            accentPreview[option] ?? 'from-gray-300 to-gray-500';

          return (
            <button
              key={labels.accents[option]}
              type="button"
              onClick={() => void setPreference({ mode, accent: option })}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? 'border-brand bg-brand-primary shadow-[var(--dashboard-shell-shadow)]'
                  : 'border-secondary bg-primary hover:border-primary hover:bg-secondary_subtle'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold capitalize text-primary">
                  {labels.accents[option]}
                </span>
                <span
                  className={`h-5 w-10 rounded-full bg-linear-to-r ${swatchClass}`}
                />
              </div>
              <p className="mt-2 m-0 text-xs uppercase tracking-[0.12em] text-tertiary">
                {active
                  ? strings.ui.appearanceScreen.activeAccent
                  : strings.ui.appearanceScreen.setAccent}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={mode === 'light' ? 'primary' : 'secondary'}
          onClick={() => void setPreference({ mode: 'light', accent })}
        >
          {strings.ui.appearanceScreen.light}
        </Button>
        <Button
          variant={mode === 'dark' ? 'primary' : 'secondary'}
          onClick={() => void setPreference({ mode: 'dark', accent })}
        >
          {strings.ui.appearanceScreen.dark}
        </Button>
      </div>
      <NotificationControls />
      <CookieConsentControls settings />
    </Card>
  );
}
