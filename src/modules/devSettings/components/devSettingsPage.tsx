import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Card } from '@astryxdesign/core/Card'
import { Box, Braces, Code2, Layers3, Palette } from 'lucide-react'
import { PortalLogo } from '@/components/brand/portalLogo'
import { TintedMarker } from '@/components/display/tintedMarker'
import { ThemeToggle } from '@/components/theme/themeToggle'
import type { DevSettingsVersions } from '@/models/devSettingsVersions'

export function DevSettingsPage({ versions }: { versions: DevSettingsVersions }) {

  const versionRows = [
    ['App', versions.app],
    ['Next.js', versions.next],
    ['React', versions.react],
    ['Astryx', versions.astryx],
  ] as const

  return (
    <main className="min-h-screen bg-body">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-18 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <PortalLogo />
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 sm:py-16">
        <header>
          <p className="text-sm font-semibold text-accent">{strings.devSettings.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{strings.devSettings.title}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-secondary">{strings.devSettings.description}</p>
        </header>
        <section className="grid gap-5 lg:grid-cols-3">
          <Card padding={5}>
            <TintedMarker size={9}><Code2 size={18} /></TintedMarker>
            <h2 className="mt-5 font-semibold">{strings.devSettings.versions}</h2>
            <dl className="mt-4 grid gap-3">
              {versionRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-secondary">{label}</dt>
                  <dd><Badge label={value} variant="neutral" /></dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card padding={5}>
            <TintedMarker size={9}><Palette size={18} /></TintedMarker>
            <h2 className="mt-5 font-semibold">{strings.devSettings.tokens}</h2>
            <div className="mt-4 flex gap-2">
              <span className="size-10 rounded-xl bg-accent" />
              <span className="size-10 rounded-xl bg-success" />
              <span className="size-10 rounded-xl bg-warning" />
              <span className="size-10 rounded-xl bg-error" />
              <span className="size-10 rounded-xl bg-muted" />
            </div>
            <p className="mt-4 text-sm leading-6 text-secondary">{strings.devSettings.colors}</p>
            <p className="mt-2 text-sm leading-6 text-secondary">{strings.devSettings.spacing}</p>
          </Card>
          <Card padding={5}>
            <TintedMarker size={9}><Layers3 size={18} /></TintedMarker>
            <h2 className="mt-5 font-semibold">{strings.devSettings.components}</h2>
            <p className="mt-3 text-sm leading-6 text-secondary">{strings.devSettings.componentsDescription}</p>
          </Card>
        </section>
        <Card padding={5}>
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-muted text-accent"><Braces size={19} /></span>
            <div>
              <h2 className="font-semibold">{strings.portal.settings.strings}</h2>
              <p className="mt-1 text-sm leading-6 text-secondary">{strings.devSettings.copy}</p>
            </div>
            <Box className="ml-auto hidden text-disabled sm:block" size={22} />
          </div>
        </Card>
        <p className="text-xs text-secondary">{strings.devSettings.onlyDevelopment}</p>
      </div>
    </main>
  )

}
