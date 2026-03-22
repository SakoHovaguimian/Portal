import { HydrationBoundary } from '@tanstack/react-query';
import { UserDetailScreen } from '@/features/users/UserDetailScreen';
import { composeUserDetailPage } from '@/composers/serverQueries';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { dehydratedState } = await composeUserDetailPage(id);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserDetailScreen userId={id} />
    </HydrationBoundary>
  );
}
