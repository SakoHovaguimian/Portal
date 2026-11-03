import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HelpScreen } from '@/modules/account-tools/HelpScreen';
import { portalAccountToolsStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';
export const metadata: Metadata = { title: copy.help.title };
export default async function Screen() {
  if (!portalModules.accountTools) notFound();
  return <HelpScreen />;
}
