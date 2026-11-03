import type { IdRouteProps } from '@/models/idRouteProps';
import type { Metadata } from 'next';
import { strings } from '@/strings';
import { UserDetailScreen } from '@/modules/users/UserDetailScreen';

export const metadata: Metadata = { title: strings.ui.userDetailScreen.userDetail };

export default async function UserDetailPage({
  params,
}: IdRouteProps) {

  const { id } = await params;

  return <UserDetailScreen userId={id} />;

}
