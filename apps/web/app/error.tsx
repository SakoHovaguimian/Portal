'use client';

import { ErrorState } from '@semantic-web/ui';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ padding: '1.5rem' }}>
      <ErrorState title="Application error" description="A route-level error boundary caught an unexpected failure." onRetry={reset} />
    </main>
  );
}
