import { strings } from '@/strings';
export const metadata = { title: strings.ui.appShell.featureRequests };
import { FeatureRequestsScreen } from '@/modules/feature-requests/FeatureRequestsScreen';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <FeatureRequestsScreen
      query={typeof params.query === 'string' ? params.query : ''}
    />
  );
}
