import { HydrationBoundary } from '@tanstack/react-query';
import { AppearanceScreen } from '@/features/settings/AppearanceScreen';
import { composeAppearancePage } from '@/composers/serverQueries';

export default async function AppearancePage() {
  const { dehydratedState } = await composeAppearancePage();

  return (
    <HydrationBoundary state={dehydratedState}>
      <AppearanceScreen />
    </HydrationBoundary>
  );
}
