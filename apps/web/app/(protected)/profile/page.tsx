import { HydrationBoundary } from '@tanstack/react-query';
import { ProfileScreen } from '@/features/users/ProfileScreen';
import { composeProfilePage } from '@/composers/serverQueries';

export default async function ProfilePage() {
  const { dehydratedState } = await composeProfilePage();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileScreen />
    </HydrationBoundary>
  );
}
