import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import { portalNotificationInboxStrings as copy } from '@/strings';

import { NotificationInboxScreen } from '@/modules/notification-inbox/NotificationInboxScreen';

export const metadata: Metadata = { title: copy.title };

export default async function Screen() {

  if (!portalModules.notifications) { notFound(); }
  return <NotificationInboxScreen />;

}
