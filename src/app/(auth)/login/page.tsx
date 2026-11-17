import type { Metadata } from 'next';

import type { SearchRouteProps } from '@/models/searchRouteProps';
import { strings } from '@/strings';

import { LoginScreen } from '@/modules/auth/LoginScreen';

export const metadata: Metadata = { title: strings.ui.loginScreen.signIn };

export default async function AuthPage({
  searchParams,
}: SearchRouteProps) {

  const query = await searchParams;
  return (
    <LoginScreen
      redirectTo={
        typeof query.redirectTo === 'string' ? query.redirectTo : undefined
      }
    />
  );

}
