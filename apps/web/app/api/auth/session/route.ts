import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MockApiClient } from '@semantic-web/api-sdk';
import {
  AppSessionSchema,
  LoginInputSchema,
  SignupInputSchema,
  type AppSession,
  type SessionUser,
} from '@semantic-web/core';
import { signSessionCookie, verifySessionCookie } from '@/lib/auth/session';
import { getFirebaseAdminAuth } from '@/lib/auth/firebaseAdmin';

function buildSession(user: SessionUser): AppSession {
  return AppSessionSchema.parse({
    user,
    token: `session-${user.id}`,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  if (body.mode === 'mock') {
    const parsed = LoginInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid login payload' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    if (password !== 'password123') {
      return NextResponse.json({ message: 'Invalid mock credentials' }, { status: 401 });
    }

    const apiClient = new MockApiClient();
    const users = await apiClient.listUsers();
    const match = users.data.find((entry) => entry.email.toLowerCase() === email);

    if (!match) {
      return NextResponse.json({ message: 'Mock user not found' }, { status: 404 });
    }

    const session = buildSession({
      id: match.id,
      externalId: match.external_id,
      email: match.email,
      firstName: match.first_name,
      lastName: match.last_name,
      role: 'admin',
    });
    const token = await signSessionCookie(session);
    const response = NextResponse.json({ success: true });
    response.cookies.set('semantic_web_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  if (body.mode === 'mock-signup') {
    const parsed = SignupInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid signup payload' }, { status: 400 });
    }

    const apiClient = new MockApiClient();

    try {
      const created = await apiClient.createUser({
        first_name: parsed.data.firstName.trim(),
        last_name: parsed.data.lastName.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        phone_number: null,
        date_of_birth: null,
      });

      const session = buildSession({
        id: created.id,
        externalId: created.external_id,
        email: created.email,
        firstName: created.first_name,
        lastName: created.last_name,
        role: 'user',
      });
      const token = await signSessionCookie(session);
      const response = NextResponse.json({ success: true });
      response.cookies.set('semantic_web_session', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create mock user';
      return NextResponse.json({ message }, { status: 409 });
    }
  }

  if (body.mode === 'firebase') {
    const idToken = String(body.idToken ?? '');
    const auth = getFirebaseAdminAuth();

    if (!auth) {
      return NextResponse.json({ message: 'Firebase admin is not configured' }, { status: 500 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const profile = (body.profile ?? {}) as Record<string, string | undefined>;
    const session = buildSession({
      id: decoded.uid,
      externalId: decoded.uid,
      email: decoded.email ?? profile.email ?? 'unknown@example.com',
      firstName: profile.firstName ?? 'Authenticated',
      lastName: profile.lastName ?? 'User',
      role: 'user',
    });
    const token = await signSessionCookie(session);
    const response = NextResponse.json({ success: true });
    response.cookies.set('semantic_web_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.json({ message: 'Unsupported auth mode' }, { status: 400 });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('semantic_web_session')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No active session' }, { status: 401 });
  }

  const session = await verifySessionCookie(token).catch(() => null);
  if (!session) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<
    SessionUser & {
      phoneNumber: string | null;
      dateOfBirth: string | null;
    }
  >;
  const apiClient = new MockApiClient();
  const currentUser = await apiClient.getUserById(session.user.id);

  if (currentUser) {
    await apiClient.updateUser(session.user.id, {
      first_name: body.firstName ?? currentUser.first_name,
      last_name: body.lastName ?? currentUser.last_name,
      email: body.email ?? currentUser.email,
      phone_number: body.phoneNumber ?? currentUser.phone_number ?? null,
      date_of_birth: body.dateOfBirth ?? currentUser.date_of_birth ?? null,
    });
  }

  const nextSession = AppSessionSchema.parse({
    ...session,
    user: {
      ...session.user,
      firstName: body.firstName ?? currentUser?.first_name ?? session.user.firstName,
      lastName: body.lastName ?? currentUser?.last_name ?? session.user.lastName,
      email: body.email ?? currentUser?.email ?? session.user.email,
    },
  });

  const response = NextResponse.json({ success: true, session: nextSession });
  response.cookies.set('semantic_web_session', await signSessionCookie(nextSession), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
