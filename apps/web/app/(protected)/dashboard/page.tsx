import { HydrationBoundary } from '@tanstack/react-query';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { composeDashboardPage } from '@/composers/serverQueries';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const { dehydratedState } = await composeDashboardPage(resolvedSearchParams);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardScreen />
    </HydrationBoundary>
  );
}
