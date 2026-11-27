import Link from 'next/link';

import { PageHeader, UiIcon } from '@/components/ui';

import { ProjectBrand } from './ProjectBrand';
import type { StatusPageProps } from './models/statusPageProps';

export function StatusPage({ title, description, icon, action, announce = false }: StatusPageProps) {

  return (
    <div className="min-h-dvh bg-secondary_subtle">
      <header className="border-b-control border-secondary bg-primary">
        <div className="mx-auto flex min-h-18 max-w-6xl items-center px-(--space-page)">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-control font-display text-xl font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
            <ProjectBrand showMark />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-(--space-page) py-16 sm:py-24">
        <div className="grid max-w-xl justify-items-start gap-5 border-s-2 border-brand ps-5 sm:ps-8">
          <UiIcon name={icon} className="size-8 text-brand-secondary" />
          <div role={announce ? 'alert' : undefined}>
            <PageHeader title={title} description={description} />
          </div>
          {action}
        </div>
      </main>
    </div>
  );

}
