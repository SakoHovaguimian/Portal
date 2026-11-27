import type { Metadata } from 'next';

import { strings } from '@/strings';

import { UsersScreen } from '@/modules/users/UsersScreen';

export const metadata: Metadata = { title: strings.ui.appShell.users };

export default function Page() {
  return <UsersScreen />;
}
