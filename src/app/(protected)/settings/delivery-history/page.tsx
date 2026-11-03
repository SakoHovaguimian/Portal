import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeliveryHistoryScreen } from '@/modules/account-tools/DeliveryHistoryScreen';
import { portalAccountToolsStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';
import { getServerSession } from '@/lib/server/getServerSession';

export const metadata: Metadata = { title: copy.deliveries.title };

export default async function Screen() {

  if (!portalModules.accountTools) { notFound(); }
  const session = await getServerSession();
  if (session?.user.role !== 'superadmin') { notFound(); }
  return <DeliveryHistoryScreen />;

}
