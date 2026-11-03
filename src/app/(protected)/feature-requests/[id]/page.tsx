import type { IdRouteProps } from '@/models/idRouteProps';
import type { Metadata } from 'next';
import { strings } from '@/strings';
import { FeatureRequestDetailScreen } from '@/modules/feature-requests/FeatureRequestDetailScreen';

export const metadata: Metadata = {
  title: strings.ui.featureRequestDetailScreen.featureRequestDetail,
};

export default async function FeatureRequestDetailPage({
  params,
}: IdRouteProps) {

  const { id } = await params;

  return <FeatureRequestDetailScreen featureRequestId={id} />;

}
