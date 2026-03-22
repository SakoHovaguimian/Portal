import { cookies } from 'next/headers';
import type { AppSession } from '@semantic-web/core';
import { verifySessionCookie } from '../auth/session';

export async function getServerSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('semantic_web_session')?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySessionCookie(token);
  } catch {
    return null;
  }
}
