'use client';
import { ErrorState } from '@/components/ui';
import { portalPublishingStrings } from '@/strings';
const copy = portalPublishingStrings.article;
export default function BlogError({ reset }: { reset: () => void }) {
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
