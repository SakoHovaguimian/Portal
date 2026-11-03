import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotificationSettingsScreen } from '@/modules/notification-inbox/NotificationSettingsScreen';
import { portalNotificationInboxStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';
export const metadata: Metadata = { title: copy.preferencesTitle };
export default async function Screen() {
  if (!portalModules.notifications) notFound();
  return <NotificationSettingsScreen />;
}
