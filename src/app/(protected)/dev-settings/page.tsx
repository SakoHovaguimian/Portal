import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isDevSettingsAvailable } from '@/services/demo/demoRuntime';
import { portalDemoStrings } from '@/strings';

import { DevSettingsScreen } from '@/modules/dev-settings/DevSettingsScreen';

export const metadata: Metadata = { title: portalDemoStrings.title };

export default function DevSettingsPage() {

  if (!isDevSettingsAvailable()) { notFound(); }
  return <DevSettingsScreen />;

}
