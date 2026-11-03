import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotificationInboxScreen } from '@/modules/notification-inbox/NotificationInboxScreen';
import { portalNotificationInboxStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';
export const metadata: Metadata = { title: copy.title };
export default async function Screen() {
  if (!portalModules.notifications) notFound();
  return <NotificationInboxScreen />;
}
