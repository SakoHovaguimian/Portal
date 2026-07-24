import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { FileText, Plus } from 'lucide-react'
import { portalResources } from '../data/portalDemoData'

export function ResourcesPage() {

  return (
    <div className="grid gap-7">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-accent">{strings.portal.resources.eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{strings.portal.resources.title}</h1>
          <p className="mt-2 max-w-2xl text-secondary">{strings.portal.resources.description}</p>
        </div>
        <Button label={strings.portal.resources.add} variant="primary" icon={<Plus size={17} />} />
      </header>
      <Card padding={0} className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1.5fr)_0.6fr_0.8fr_0.6fr] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-secondary md:grid">
          <span>{strings.shared.resources}</span>
          <span>{strings.portal.resources.type}</span>
          <span>{strings.portal.resources.owner}</span>
          <span>{strings.portal.resources.updated}</span>
        </div>
        <div className="divide-y divide-border">
          {portalResources.map((resource) => (
            <article key={resource.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.5fr)_0.6fr_0.8fr_0.6fr] md:items-center md:gap-4 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-muted text-accent"><FileText size={18} /></span>
                <span className="truncate text-sm font-semibold">{resource.name}</span>
              </div>
              <span><Badge label={resource.type} variant="neutral" /></span>
              <span className="text-sm">{resource.owner}</span>
              <span className="text-sm text-secondary">{resource.updated}</span>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )

}
