'use client';

import { ErrorState } from '@/components/ui';
import type { RetryErrorProps } from '@/models/retryErrorProps';
import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.article;
export default function BlogError({ reset }: RetryErrorProps) {

  return (
    <main className="min-h-96 py-24">
      <ErrorState
        title={copy.articleUnavailableTitle}
        description={copy.articleUnavailableDescription}
        onRetry={reset}
      />
    </main>
  );

}
