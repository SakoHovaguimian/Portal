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
    <main className="auth-scene min-h-screen bg-secondary px-6 py-12 sm:px-8">
      <div className="auth-grid-glow" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-lg items-center">
        <LoginScreen
          redirectTo={
            typeof query.redirectTo === 'string' ? query.redirectTo : undefined
          }
        />
      </div>
    </main>
  );

}
