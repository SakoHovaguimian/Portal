'use client';

import { strings } from '@/strings';
import { ErrorState } from '@/components/ui';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
