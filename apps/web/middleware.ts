import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionCookie } from './lib/auth/session';

const protectedPrefixes = ['/dashboard', '/users', '/feature-requests', '/settings', '/profile', '/experience'];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('semantic_web_session')?.value;
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  const session = sessionCookie ? await verifySessionCookie(sessionCookie).catch(() => null) : null;

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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
    '/profile/:path*',
    '/experience/:path*',
  ],
};
