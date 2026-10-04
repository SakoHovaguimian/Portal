import { strings } from '@/strings';
export const metadata = { title: strings.ui.profileScreen.yourProfile };
import { ProfileScreen } from '@/modules/users/ProfileScreen';

export default async function ProfilePage() {
  return <ProfileScreen />;
}
