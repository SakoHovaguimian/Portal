import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DevicesScreen } from '@/modules/account-tools/DevicesScreen';
import { portalAccountToolsStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';

export const metadata: Metadata = { title: copy.devices.title };

export default async function Screen() {

  if (!portalModules.accountTools) { notFound(); }
  return <DevicesScreen />;

}
