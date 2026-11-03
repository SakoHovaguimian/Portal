'use client';

import type { GlobalErrorProps } from '@/models/globalErrorProps';
import { strings } from '@/strings';
import { ErrorState } from '@/components/ui';

export default function GlobalError({
  reset,
}: GlobalErrorProps) {

  return (
    <main style={{ padding: '1.5rem' }}>
      <ErrorState
        title={strings.ui.error.applicationError}
        description={strings.ui.error.thisPageCouldNotBeLoadedPleaseTryAgain}
        onRetry={reset}
      />
    </main>
  );

}
