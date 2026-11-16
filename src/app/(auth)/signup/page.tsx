import type { Metadata } from 'next';

import type { SearchRouteProps } from '@/models/searchRouteProps';
import { strings } from '@/strings';

import { SignupScreen } from '@/modules/auth/SignupScreen';

export const metadata: Metadata = { title: strings.ui.signupScreen.createAccount };

export default async function AuthPage({
  searchParams,
}: SearchRouteProps) {

  const query = await searchParams;
  return (
    <SignupScreen
      redirectTo={
        typeof query.redirectTo === 'string' ? query.redirectTo : undefined
      }
    />
  );

}
