import { strings } from '@/content/strings'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, MessageSquareText, ShieldCheck } from 'lucide-react'
import { PortalLogo } from '@/components/brand/portalLogo'
import { ThemeToggle } from '@/components/theme/themeToggle'

export function AuthShell({ children }: { children: React.ReactNode }) {

  return (
    <main className="grid min-h-screen bg-body lg:grid-cols-[minmax(380px,0.85fr)_minmax(560px,1.15fr)]">
      <aside className="relative hidden overflow-hidden bg-[#08281A] px-10 py-9 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_18%_12%,#8FE3BC_0,transparent_28%),radial-gradient(circle_at_90%_80%,#0E9F6E_0,transparent_35%)]" />
        <div className="landing-grid absolute inset-0 opacity-20" />
        <div className="relative z-10">
          <PortalLogo inverted />
        </div>
        <div className="relative z-10 my-auto max-w-md py-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#C9C2FF]">{strings.auth.shell.eyebrow}</p>
          <h1 className="text-balance text-[clamp(2.4rem,4.2vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            {strings.auth.shell.title}
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-8 text-white/72">
            {strings.auth.shell.description}
          </p>
          <ul className="mt-10 grid gap-4 text-sm text-white/82">
            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#C9C2FF]" size={19} /> {strings.auth.shell.itemOne}</li>
            <li className="flex items-center gap-3"><MessageSquareText className="text-[#C9C2FF]" size={19} /> {strings.auth.shell.itemTwo}</li>
            <li className="flex items-center gap-3"><ShieldCheck className="text-[#C9C2FF]" size={19} /> {strings.auth.shell.itemThree}</li>
          </ul>
        </div>
        <p className="relative z-10 text-xs text-white/45">{strings.auth.shell.footnote}</p>
      </aside>
      <section className="flex min-h-screen flex-col bg-surface">
        <header className="flex h-18 items-center justify-between border-b border-border px-5 sm:px-8 lg:justify-end">
          <div className="lg:hidden"><PortalLogo /></div>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-[480px]">
            <Link href="/" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-medium text-secondary transition hover:text-primary">
              <ArrowLeft size={16} aria-hidden="true" /> {strings.auth.shell.back}
            </Link>
            {children}
          </div>
        </div>
      </section>
    </main>
  )

}
