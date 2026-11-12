import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import { portalNotificationInboxStrings as copy } from '@/strings';

import { NotificationSettingsScreen } from '@/modules/notification-inbox/NotificationSettingsScreen';

export const metadata: Metadata = { title: copy.preferencesTitle };

export default async function Screen() {

  if (!portalModules.notifications) { notFound(); }
  return <NotificationSettingsScreen />;

}
