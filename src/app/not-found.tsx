import type { Metadata } from 'next';
import Link from 'next/link';

import { StatusPage } from '@/components/StatusPage';
import { Button, UiIcon } from '@/components/ui';
import { getProjectRouting } from '@/config/getProjectRouting';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { strings } from '@/strings';

export const metadata: Metadata = { title: strings.ui.domainErrors.resourceNotFound };

export default function NotFound() {

  return (
    <StatusPage
      title={strings.ui.domainErrors.resourceNotFound}
      icon="search"
      action={(
        <Button asChild>
          <Link href={getDefaultProjectRoute(getProjectRouting())}>
            {strings.app.backToWorkspace}
            <UiIcon name="arrowRight" className="size-4" />
          </Link>
        </Button>
      )}
    />
  );

}
