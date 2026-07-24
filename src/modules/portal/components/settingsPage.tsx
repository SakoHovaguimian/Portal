import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Card } from '@astryxdesign/core/Card'
import { Braces, Cable, KeyRound, Palette, Server } from 'lucide-react'
import type { AuthMode, RealtimeMode } from '@/config/environment'

interface SettingsPageProps {
  authMode: AuthMode
  realtimeMode: RealtimeMode
  apiUrl: string
}

export function SettingsPage({ authMode, realtimeMode, apiUrl }: SettingsPageProps) {

  const rows = [
    {
      label: strings.portal.settings.authentication,
      value: authMode,
      detail: strings.portal.settings.reviewAuth,
      icon: KeyRound,
    },
    {
      label: strings.portal.settings.realtime,
      value: realtimeMode,
      detail: strings.portal.settings.reviewRealtime,
      icon: Cable,
    },
    {
      label: strings.portal.settings.api,
      value: apiUrl,
      detail: strings.portal.settings.reviewApi,
      icon: Server,
    },
    {
      label: strings.portal.settings.theme,
      value: strings.shared.portal,
      detail: strings.portal.settings.reviewTheme,
      icon: Palette,
    },
    {
      label: strings.portal.settings.strings,
      value: 'strict',
      detail: strings.portal.settings.reviewStrings,
      icon: Braces,
    },
  ] as const

  return (
    <div className="grid gap-7">
      <header>
        <p className="text-sm font-semibold text-accent">{strings.portal.settings.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{strings.portal.settings.title}</h1>
        <p className="mt-2 max-w-2xl text-secondary">{strings.portal.settings.description}</p>
      </header>
      <Card padding={0} className="overflow-hidden">
        <div className="hidden grid-cols-[0.7fr_0.6fr_1.5fr] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-secondary md:grid">
          <span>{strings.portal.settings.capability}</span>
          <span>{strings.portal.settings.current}</span>
          <span>{strings.portal.settings.nextStep}</span>
        </div>
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <article key={row.label} className="grid gap-3 px-5 py-5 md:grid-cols-[0.7fr_0.6fr_1.5fr] md:items-center md:gap-4 md:px-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <row.icon size={18} className="text-accent" />
                {row.label}
              </div>
              <span><Badge label={row.value} variant="neutral" /></span>
              <p className="text-sm leading-6 text-secondary">{row.detail}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )

}
