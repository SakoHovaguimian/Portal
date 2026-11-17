import type { Metadata } from 'next';

import type { SearchRouteProps } from '@/models/searchRouteProps';
import { strings } from '@/strings';

import { UsersScreen } from '@/modules/users/UsersScreen';

export const metadata: Metadata = { title: strings.ui.appShell.users };

export default async function Page({
  searchParams,
}: SearchRouteProps) {

  const params = await searchParams;
  return (
    <UsersScreen query={typeof params.query === 'string' ? params.query : ''} />
  );

}
