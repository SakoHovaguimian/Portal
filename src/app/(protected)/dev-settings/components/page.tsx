import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isDevSettingsAvailable } from '@/services/demo/demoRuntime';
import { strings } from '@/strings';

import { DevSettingsScreen } from '@/modules/dev-settings/DevSettingsScreen';

export const metadata: Metadata = { title: strings.componentLibrary.title };

export default function ComponentLibraryPage() {

  if (!isDevSettingsAvailable()) { notFound(); }
  return <DevSettingsScreen />;

}
