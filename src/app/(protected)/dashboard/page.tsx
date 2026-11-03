import type { Metadata } from 'next';
import { strings } from '@/strings';
import { DashboardScreen } from '@/modules/dashboard/DashboardScreen';

export const metadata: Metadata = { title: strings.ui.dashboardScreen.dashboard };

export default async function DashboardPage() {
  return <DashboardScreen />;
}
