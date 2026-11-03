import type { Metadata } from 'next';
import { strings } from '@/strings';
import { ProfileScreen } from '@/modules/users/ProfileScreen';

export const metadata: Metadata = { title: strings.ui.profileScreen.yourProfile };

export default async function ProfilePage() {
  return <ProfileScreen />;
}
