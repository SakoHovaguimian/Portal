import { NextRequest, NextResponse } from 'next/server';

import { getProjectRouting } from '@/config/getProjectRouting';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { getContainer } from '@/container';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { sessionCookieName } from '@/services/session/sessionCodec';

// **************************************
// MARK: - PROXY PROTECTED ROUTE
// **************************************

export async function proxy(request: NextRequest) {

  const token = request.cookies.get(sessionCookieName)?.value;
  const runtime = await getEffectiveRuntime(request.cookies);
  const session = token ? await (await getContainer(runtime.demoMode)).sessionService.read(token) : null;
  const authRoute = ['/login', '/signup'].includes(request.nextUrl.pathname);
  if (!session && !authRoute) {

    const url = new URL('/login', request.url);
    url.searchParams.set(
      'redirectTo',
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);

  }
  if (session && authRoute) { return NextResponse.redirect(new URL(getDefaultProjectRoute(getProjectRouting(), session.user.role), request.url)); }
  return NextResponse.next();

}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/users/:path*',
    '/feature-requests/:path*',
    '/settings/:path*',
    '/dev-settings/:path*',
    '/profile/:path*',
    '/experience/:path*',
    '/chat/:path*',
    '/jobs/:path*',
    '/notifications/:path*',
    '/saved/:path*',
    '/onboarding/:path*',
    '/help/:path*',
    '/admin/:path*',
  ],
};
