import { strings } from '@/content/strings'
import Link from 'next/link'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import {
  ArrowRight,
  Braces,
  Cable,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  KeyRound,
  Layers3,
  Palette,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { PortalLogo } from '@/components/brand/portalLogo'
import { TintedMarker } from '@/components/display/tintedMarker'
import { ThemeToggle } from '@/components/theme/themeToggle'

const capabilities = [
  {
    icon: KeyRound,
    title: strings.marketing.capabilities.identityTitle,
    description: strings.marketing.capabilities.identityDescription,
  },
  {
    icon: Cable,
    title: strings.marketing.capabilities.realtimeTitle,
    description: strings.marketing.capabilities.realtimeDescription,
  },
  {
    icon: Palette,
    title: strings.marketing.capabilities.systemTitle,
    description: strings.marketing.capabilities.systemDescription,
  },
  {
    icon: Braces,
    title: strings.marketing.capabilities.copyTitle,
    description: strings.marketing.capabilities.copyDescription,
  },
  {
    icon: Server,
    title: strings.marketing.capabilities.apiTitle,
    description: strings.marketing.capabilities.apiDescription,
  },
  {
    icon: Settings2,
    title: strings.marketing.capabilities.operationsTitle,
    description: strings.marketing.capabilities.operationsDescription,
  },
] as const

const workflowSteps = [
  { number: '01', title: strings.marketing.workflowSteps.decide, description: strings.marketing.workflowSteps.decideDescription },
  { number: '02', title: strings.marketing.workflowSteps.rename, description: strings.marketing.workflowSteps.renameDescription },
  { number: '03', title: strings.marketing.workflowSteps.model, description: strings.marketing.workflowSteps.modelDescription },
  { number: '04', title: strings.marketing.workflowSteps.verify, description: strings.marketing.workflowSteps.verifyDescription },
] as const

const foundationItems = [
  strings.marketing.foundationItems.routes,
  strings.marketing.foundationItems.responsive,
  strings.marketing.foundationItems.forms,
  strings.marketing.foundationItems.data,
  strings.marketing.foundationItems.theme,
  strings.marketing.foundationItems.docs,
] as const

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: strings.shared.portal,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description: strings.metadata.layout.description,
}

export function LandingPage() {

  return (
    <main className="min-h-screen overflow-hidden bg-body text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="sticky top-0 z-50 border-b border-border/80 bg-body/88 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <PortalLogo />
          <nav aria-label={strings.marketing.navigation.primary} className="hidden items-center gap-8 md:flex">
            <a href="#capabilities" className="focus-ring rounded-sm text-sm font-medium text-secondary transition hover:text-primary">{strings.marketing.navigation.capabilities}</a>
            <a href="#workflow" className="focus-ring rounded-sm text-sm font-medium text-secondary transition hover:text-primary">{strings.marketing.navigation.workflow}</a>
            <a href="#foundations" className="focus-ring rounded-sm text-sm font-medium text-secondary transition hover:text-primary">{strings.marketing.navigation.foundations}</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button href="/login" label={strings.shared.signIn} variant="ghost" className="hidden sm:inline-flex" />
            <Button href="/portal" label={strings.marketing.openDemo} variant="primary" endContent={<ArrowRight size={15} aria-hidden="true" />} />
          </div>
        </div>
      </header>

      <section className="relative px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:pb-32">
        <div className="landing-grid pointer-events-none absolute inset-0 -top-20 opacity-55" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-glow)_0%,transparent_68%)]" />
        <div className="relative mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-[920px] text-center">
            <div className="mb-7 inline-flex">
              <Badge variant="neutral" label={strings.marketing.eyebrow} icon={<Sparkles size={13} aria-hidden="true" />} />
            </div>
            <h1 className="text-gradient text-balance text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.072em]">
              {strings.marketing.headlineStart}<br />{strings.marketing.headlineEnd}
            </h1>
            <p className="mx-auto mt-8 max-w-[720px] text-balance text-lg leading-8 text-secondary sm:text-xl sm:leading-9">{strings.marketing.intro}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/portal" label={strings.marketing.openDemo} variant="primary" size="lg" endContent={<ArrowRight size={17} aria-hidden="true" />} className="w-full sm:w-auto" />
              <Button href="#capabilities" label={strings.marketing.exploreTemplate} variant="secondary" size="lg" className="w-full sm:w-auto" />
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-secondary">
              <ShieldCheck size={14} className="text-success" aria-hidden="true" />
              {strings.marketing.demoNote}
            </p>
          </div>

          <div className="glass-surface relative mx-auto mt-16 max-w-[1060px] overflow-hidden rounded-[28px] p-2 sm:mt-20 sm:p-3">
            <div className="overflow-hidden rounded-[21px] border border-border bg-surface shadow-sm">
              <div className="flex h-12 items-center gap-2 border-b border-border px-4">
                <span className="size-2.5 rounded-full bg-error/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
                <div className="mx-auto h-6 w-[42%] rounded-md bg-muted" />
              </div>
              <div className="grid min-h-[500px] sm:grid-cols-[190px_1fr]">
                <aside className="hidden border-r border-border bg-muted/60 p-4 sm:block">
                  <div className="mb-8 flex items-center gap-2.5 px-1 text-sm font-semibold">
                    <span className="grid size-7 place-items-center rounded-md bg-accent text-on-accent"><Layers3 size={15} /></span>
                    {strings.shared.portal}
                  </div>
                  <div className="space-y-1 text-xs font-medium text-secondary">
                    <div className="flex items-center gap-2 rounded-md bg-accent-muted px-3 py-2.5 text-accent"><Layers3 size={14} /> {strings.shared.overview}</div>
                    <div className="flex items-center gap-2 px-3 py-2.5"><Clock3 size={14} /> {strings.shared.activity}</div>
                    <div className="flex items-center gap-2 px-3 py-2.5"><UsersRound size={14} /> {strings.shared.team}</div>
                    <div className="flex items-center gap-2 px-3 py-2.5"><FileText size={14} /> {strings.shared.resources}</div>
                  </div>
                </aside>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-secondary">{strings.marketing.preview.workspace}</p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">{strings.marketing.preview.greeting}</h2>
                      <p className="mt-1 text-xs text-secondary">{strings.marketing.preview.summary}</p>
                    </div>
                    <div className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-on-accent">{strings.portal.dashboard.inviteMember}</div>
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    <PreviewMetric label={strings.marketing.preview.members} value="12" detail={strings.demo.members.active} />
                    <PreviewMetric label={strings.marketing.preview.activeItems} value="28" detail={strings.portal.dashboard.metricActiveDetail} />
                    <PreviewMetric label={strings.marketing.preview.completion} value="86%" detail={strings.portal.dashboard.metricCompletionDetail} />
                  </div>
                  <div className="mt-5 rounded-md border border-border bg-card p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold">{strings.marketing.preview.latestActivity}</p>
                      <span className="text-xs font-medium text-accent">{strings.shared.viewAll}</span>
                    </div>
                    <div className="divide-y divide-border">
                      <PreviewActivity icon={<CheckCircle2 size={15} />} title={strings.marketing.preview.designReview} detail={strings.demo.activities.approvedDetail} />
                      <PreviewActivity icon={<UsersRound size={15} />} title={strings.marketing.preview.accessUpdated} detail={strings.demo.activities.accessDetail} />
                      <PreviewActivity icon={<FileText size={15} />} title={strings.marketing.preview.guidePublished} detail={strings.demo.activities.guideDetail} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-y border-border bg-surface px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-[720px]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{strings.marketing.capabilityEyebrow}</p>
            <h2 className="mt-4 text-balance text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.055em]">{strings.marketing.capabilityTitle}</h2>
            <p className="mt-5 max-w-[620px] text-lg leading-8 text-secondary">{strings.marketing.capabilityDescription}</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <Card key={capability.title} padding={6} className="group min-h-[285px] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <TintedMarker size={10}><capability.icon size={20} aria-hidden="true" /></TintedMarker>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.035em]">{capability.title}</h3>
                <p className="mt-3 leading-7 text-secondary">{capability.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-[#17122F] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1160px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Badge variant="neutral" label={strings.marketing.workflowEyebrow} />
            <h2 className="mt-6 text-balance text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">{strings.marketing.workflowTitle}</h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/68">{strings.marketing.workflowDescription}</p>
          </div>
          <ol className="grid gap-4">
            {workflowSteps.map((step) => (
              <li key={step.number} className="grid grid-cols-[auto_1fr] gap-4 rounded-[22px] border border-white/10 bg-white/[0.06] p-5 sm:p-6">
                <span className="text-xs font-semibold tracking-[0.14em] text-[#B8AEFF]">{step.number}</span>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/64">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="foundations" className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1160px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{strings.marketing.foundationsEyebrow}</p>
            <h2 className="mt-4 text-balance text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.055em]">{strings.marketing.foundationsTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-secondary">{strings.marketing.foundationsDescription}</p>
          </div>
          <div className="grid gap-3">
            {foundationItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[18px] border border-border bg-card p-4 shadow-sm">
                <Check className="mt-0.5 shrink-0 text-success" size={18} />
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[30px] border border-white/10 bg-[#201A44] px-6 py-16 text-center text-white shadow-xl sm:px-12 sm:py-20">
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_18%_8%,#7C6FF2_0,transparent_28%),radial-gradient(circle_at_82%_92%,#A79CFF_0,transparent_32%)]" />
          <div className="relative mx-auto max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-[0.17em] text-white/75">{strings.marketing.finalEyebrow}</p>
            <h2 className="mt-5 text-balance text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-white">{strings.marketing.finalTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/75">{strings.marketing.finalDescription}</p>
            <div className="mt-9">
              <Button href="/signup" label={strings.marketing.start} variant="primary" size="lg" endContent={<ArrowRight size={17} />} />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div><PortalLogo /><p className="mt-3 text-xs text-secondary">{strings.marketing.copyright}</p></div>
          <nav aria-label={strings.marketing.navigation.footer} className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-secondary">
            <Link href="/privacy" className="hover:text-primary">{strings.shared.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-primary">{strings.shared.terms}</Link>
            <Link href="/login" className="hover:text-primary">{strings.shared.signIn}</Link>
          </nav>
        </div>
      </footer>
    </main>
  )

}

function PreviewMetric({ label, value, detail }: { label: string, value: string, detail: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="text-xs text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-[0.68rem] text-secondary">{detail}</p>
    </div>
  )
}

function PreviewActivity({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <span>
        <span className="block text-xs font-semibold">{title}</span>
        <span className="mt-1 block text-[0.68rem] leading-5 text-secondary">{detail}</span>
      </span>
    </div>
  )
}
