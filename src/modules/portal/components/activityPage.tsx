import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Card } from '@astryxdesign/core/Card'
import { Activity } from 'lucide-react'
import { TintedMarker } from '@/components/display/tintedMarker'
import { portalActivities } from '../data/portalDemoData'

export function ActivityPage() {

  return (
    <div className="grid gap-7">
      <header>
        <p className="text-sm font-semibold text-accent">{strings.portal.activity.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{strings.portal.activity.title}</h1>
        <p className="mt-2 max-w-2xl text-secondary">{strings.portal.activity.description}</p>
      </header>
      <Card padding={0} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <TintedMarker size={8}><Activity size={17} /></TintedMarker>
            <h2 className="font-semibold">{strings.portal.activity.allActivity}</h2>
          </div>
          <Badge label={`${portalActivities.length}`} variant="neutral" />
        </div>
        <div className="divide-y divide-border">
          {portalActivities.map((activity) => (
            <article key={activity.id} className="flex items-start gap-4 px-5 py-5 sm:px-6">
              <span className={`mt-1 size-2.5 shrink-0 rounded-full ${activity.tone === 'success' ? 'bg-success' : activity.tone === 'warning' ? 'bg-warning' : 'bg-accent'}`} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{activity.title}</h3>
                <p className="mt-1 text-sm leading-6 text-secondary">{activity.detail}</p>
              </div>
              <time className="shrink-0 text-xs text-secondary">{activity.time}</time>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )

}
