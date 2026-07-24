import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { UserPlus } from 'lucide-react'
import { portalMembers } from '../data/portalDemoData'

export function TeamPage() {

  return (
    <div className="grid gap-7">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-accent">{strings.portal.team.eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{strings.portal.team.title}</h1>
          <p className="mt-2 max-w-2xl text-secondary">{strings.portal.team.description}</p>
        </div>
        <Button label={strings.portal.team.invite} variant="primary" icon={<UserPlus size={17} />} />
      </header>
      <Card padding={0} className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1.3fr)_0.7fr_0.7fr_0.7fr] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-secondary md:grid">
          <span>{strings.shared.team}</span>
          <span>{strings.portal.team.role}</span>
          <span>{strings.portal.team.status}</span>
          <span>{strings.portal.team.lastActive}</span>
        </div>
        <div className="divide-y divide-border">
          {portalMembers.map((member) => (
            <article key={member.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.3fr)_0.7fr_0.7fr_0.7fr] md:items-center md:gap-4 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-muted text-xs font-semibold text-accent">{member.initials}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{member.name}</span>
                  <span className="block truncate text-xs text-secondary">{member.email}</span>
                </span>
              </div>
              <span className="text-sm">{member.role}</span>
              <span><Badge label={member.status} variant={member.status === strings.demo.members.active ? 'success' : 'neutral'} /></span>
              <span className="text-sm text-secondary">{member.lastActive}</span>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )

}
