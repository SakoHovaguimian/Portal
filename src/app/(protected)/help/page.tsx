import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import { portalAccountToolsStrings as copy } from '@/strings';

import { HelpScreen } from '@/modules/account-tools/HelpScreen';

export const metadata: Metadata = { title: copy.help.title };

export default async function Screen() {

  if (!portalModules.accountTools) { notFound(); }
  return <HelpScreen />;

}
