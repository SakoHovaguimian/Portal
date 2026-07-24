import { strings } from '@/content/strings'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Gauge,
  Settings,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import { TintedMarker } from '@/components/display/tintedMarker'
import type { PortalMetric } from '@/models/portalMetric'
import { portalActivities } from '../data/portalDemoData'

const metrics: PortalMetric[] = [
  {
    label: strings.portal.dashboard.metricMembers,
    value: '12',
    detail: strings.portal.dashboard.metricMembersDetail,
    tone: 'accent',
  },
  {
    label: strings.portal.dashboard.metricActive,
    value: '28',
    detail: strings.portal.dashboard.metricActiveDetail,
    tone: 'warning',
  },
  {
    label: strings.portal.dashboard.metricCompletion,
    value: '86%',
    detail: strings.portal.dashboard.metricCompletionDetail,
    tone: 'success',
  },
  {
    label: strings.portal.dashboard.metricResponse,
    value: '2.4h',
    detail: strings.portal.dashboard.metricResponseDetail,
    tone: 'info',
  },
]

export function DashboardPage() {

  return (
    <div className="grid gap-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-secondary">{strings.portal.dashboard.eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {strings.portal.dashboard.title}
          </h1>
          <p className="mt-2 text-secondary">{strings.portal.dashboard.description}</p>
        </div>
        <Button href="/portal/team" label={strings.portal.dashboard.inviteMember} variant="primary" size="lg" icon={<UserPlus size={17} />} />
      </section>

      <Card padding={5} className="overflow-hidden border-accent/25 bg-[linear-gradient(135deg,var(--color-accent-muted),var(--color-background-card))]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <TintedMarker size={11}>
            <CheckCircle2 size={22} aria-hidden="true" />
          </TintedMarker>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{strings.portal.dashboard.launchTitle}</h2>
              <Badge label={strings.portal.dashboard.docsPath} variant="neutral" />
            </div>
            <p className="mt-1 text-sm leading-6 text-secondary">{strings.portal.dashboard.launchDescription}</p>
          </div>
          <Button href="/portal/settings" label={strings.portal.dashboard.launchAction} variant="secondary" endContent={<ArrowRight size={15} />} />
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.75fr]">
        <Card padding={0} className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
            <div>
              <h2 className="font-semibold">{strings.portal.dashboard.recentActivity}</h2>
              <p className="mt-1 text-xs text-secondary">{strings.portal.dashboard.recentActivityDescription}</p>
            </div>
            <Button href="/portal/activity" label={strings.shared.viewAll} variant="ghost" size="sm" endContent={<ArrowRight size={14} />} />
          </div>
          <div className="grid gap-1 p-3">
            {portalActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-md px-3 py-3 transition hover:bg-muted sm:px-4">
                <span className={`mt-1 size-2.5 shrink-0 rounded-full ${activity.tone === 'success' ? 'bg-success' : activity.tone === 'warning' ? 'bg-warning' : 'bg-accent'}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{activity.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-secondary">{activity.detail}</span>
                </span>
                <span className="shrink-0 text-xs text-secondary">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid content-start gap-5">
          <Card padding={5}>
            <h2 className="font-semibold">{strings.portal.dashboard.quickActions}</h2>
            <div className="mt-4 grid gap-2">
              <Button href="/portal/team" label={strings.portal.dashboard.inviteMember} variant="secondary" icon={<UserPlus size={16} />} className="justify-start" />
              <Button href="/portal/resources" label={strings.portal.dashboard.addResource} variant="secondary" icon={<BookOpen size={16} />} className="justify-start" />
              <Button href="/portal/settings" label={strings.portal.dashboard.reviewSettings} variant="secondary" icon={<Settings size={16} />} className="justify-start" />
            </div>
          </Card>
          <Card padding={5}>
            <Gauge size={20} className="text-accent" />
            <h2 className="mt-4 font-semibold">{strings.portal.dashboard.architecture}</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">{strings.portal.dashboard.architectureDescription}</p>
          </Card>
        </div>
      </section>
    </div>
  )

}

function MetricCard({ metric }: { metric: PortalMetric }) {

  const icons = {
    accent: <UsersRound size={19} />,
    warning: <Clock3 size={19} />,
    success: <CheckCircle2 size={19} />,
    info: <Gauge size={19} />,
  }

  const tones = {
    accent: 'text-accent',
    warning: 'text-warning',
    success: 'text-success',
    info: 'text-accent',
  }

  return (
    <Card padding={5}>
      <div className="flex items-center gap-2.5">
        <span className={`shrink-0 ${tones[metric.tone]}`}>{icons[metric.tone]}</span>
        <p className="text-sm font-medium text-secondary">{metric.label}</p>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{metric.value}</p>
      <p className="mt-1 text-xs text-secondary">{metric.detail}</p>
    </Card>
  )

}
