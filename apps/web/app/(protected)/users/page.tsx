import { HydrationBoundary } from '@tanstack/react-query';
import { UsersScreen } from '@/features/users/UsersScreen';
import { composeUsersPage } from '@/composers/serverQueries';

export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const { dehydratedState } = await composeUsersPage(resolvedSearchParams);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersScreen query={typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : ''} />
    </HydrationBoundary>
  );
}
