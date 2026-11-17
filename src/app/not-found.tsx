import type { Metadata } from 'next';
import Link from 'next/link';

import { Card, buttonClassName } from '@/components/ui';
import { getProjectRouting } from '@/config/getProjectRouting';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { strings } from '@/strings';

export const metadata: Metadata = { title: strings.ui.domainErrors.resourceNotFound };

export default function NotFound() {

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card className="grid gap-4">
        <h1 className="text-2xl font-semibold">{strings.ui.domainErrors.resourceNotFound}</h1>
        <Link href={getDefaultProjectRoute(getProjectRouting())} className={buttonClassName()}>
          {strings.app.backToWorkspace}
        </Link>
      </Card>
    </main>
  );

}
