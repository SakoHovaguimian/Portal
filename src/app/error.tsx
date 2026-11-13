'use client';

import { ErrorState } from '@/components/ui';
import type { GlobalErrorProps } from '@/models/globalErrorProps';
import { strings } from '@/strings';

export default function GlobalError({
  reset,
}: GlobalErrorProps) {

  return (
    <main style={{ padding: '1.5rem' }}>
      <ErrorState
        title={strings.ui.error.applicationError}
        description={strings.ui.error.thisPageCouldNotBeLoadedPleaseTryAgainHint}
        onRetry={reset}
      />
    </main>
  );

}
