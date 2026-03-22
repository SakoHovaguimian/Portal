import { HydrationBoundary } from '@tanstack/react-query';
import { FeatureRequestsScreen } from '@/features/feature-requests/FeatureRequestsScreen';
import { composeFeatureRequestsPage } from '@/composers/serverQueries';

export default async function FeatureRequestsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const { dehydratedState } = await composeFeatureRequestsPage(resolvedSearchParams);

  return (
    <HydrationBoundary state={dehydratedState}>
      <FeatureRequestsScreen query={typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : ''} />
    </HydrationBoundary>
  );
}
