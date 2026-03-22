import { HydrationBoundary } from '@tanstack/react-query';
import { FeatureRequestDetailScreen } from '@/features/feature-requests/FeatureRequestDetailScreen';
import { composeFeatureRequestDetailPage } from '@/composers/serverQueries';

export default async function FeatureRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { dehydratedState } = await composeFeatureRequestDetailPage(id);

  return (
    <HydrationBoundary state={dehydratedState}>
      <FeatureRequestDetailScreen featureRequestId={id} />
    </HydrationBoundary>
  );
}
