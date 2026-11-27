'use client';

import { StatusPage } from '@/components/StatusPage';
import { Button, UiIcon } from '@/components/ui';
import type { GlobalErrorProps } from '@/models/globalErrorProps';
import { strings } from '@/strings';

export default function GlobalError({
  reset,
}: GlobalErrorProps) {

  return (
    <StatusPage
      announce
      title={strings.ui.error.applicationError}
      description={strings.ui.error.thisPageCouldNotBeLoadedPleaseTryAgainHint}
      icon="warning"
      action={(
        <Button variant="secondary" onClick={reset}>
          <UiIcon name="refresh" className="size-4" />
          {strings.ui.states.retry}
        </Button>
      )}
    />
  );

}
