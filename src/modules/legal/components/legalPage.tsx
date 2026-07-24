import { strings } from '@/content/strings'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { PortalLogo } from '@/components/brand/portalLogo'
import { ThemeToggle } from '@/components/theme/themeToggle'

interface LegalPageProps {
  title: string
  context: 'terms' | 'privacy'
}

const checklistItems = [
  strings.legal.itemIdentity,
  strings.legal.itemData,
  strings.legal.itemRegion,
  strings.legal.itemReview,
] as const

export function LegalPage({ title, context }: LegalPageProps) {

  const introduction = context === 'privacy'
    ? strings.legal.privacyIntro
    : strings.legal.termsIntro

  return (
    <main className="min-h-screen bg-body">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-18 max-w-[980px] items-center justify-between px-5 sm:px-8">
          <PortalLogo />
          <ThemeToggle />
        </div>
      </header>
      <article className="mx-auto max-w-[800px] px-5 py-14 sm:px-8 sm:py-20">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm font-medium text-secondary hover:text-primary">
          <ArrowLeft size={16} />
          {strings.legal.back}
        </Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-accent">{strings.legal.templateNotice}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{title}</h1>
        <div className="mt-10 rounded-md border border-warning/30 bg-warning-muted p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="mt-0.5 shrink-0 text-warning" />
            <p className="text-sm leading-6 text-secondary">{strings.legal.templateDescription}</p>
          </div>
        </div>
        <p className="mt-10 text-base leading-8 text-secondary">{introduction}</p>
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">{strings.legal.checklistTitle}</h2>
          <ul className="mt-5 grid gap-3">
            {checklistItems.map((item) => (
              <li key={item} className="rounded-md border border-border bg-card px-4 py-3 text-sm leading-6 text-secondary">{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )

}
