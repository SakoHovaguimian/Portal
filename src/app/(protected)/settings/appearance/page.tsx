import { strings } from '@/strings';
export const metadata = { title: strings.ui.appearanceScreen.appearance };
import { AppearanceScreen } from '@/modules/settings/AppearanceScreen';

export default async function AppearancePage() {
  return <AppearanceScreen />;
}
