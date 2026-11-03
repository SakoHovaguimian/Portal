import type { SearchRouteProps } from '@/models/searchRouteProps';
import type { Metadata } from 'next';
import { strings } from '@/strings';
import { FeatureRequestsScreen } from '@/modules/feature-requests/FeatureRequestsScreen';

export const metadata: Metadata = { title: strings.ui.appShell.featureRequests };

export default async function Page({
  searchParams,
}: SearchRouteProps) {

  const params = await searchParams;
  return (
    <FeatureRequestsScreen
      query={typeof params.query === 'string' ? params.query : ''}
    />
  );

}
