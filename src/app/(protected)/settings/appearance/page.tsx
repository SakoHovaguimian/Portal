import type { Metadata } from 'next';
import { strings } from '@/strings';
import { AppearanceScreen } from '@/modules/settings/AppearanceScreen';

export const metadata: Metadata = { title: strings.ui.appearanceScreen.appearance };

export default async function AppearancePage() {
  return <AppearanceScreen />;
}
