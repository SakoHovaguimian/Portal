import { strings } from '@/strings';
export const metadata = { title: strings.ui.dashboardScreen.dashboard };
import { DashboardScreen } from '@/modules/dashboard/DashboardScreen';

export default async function DashboardPage() {
  return <DashboardScreen />;
}
