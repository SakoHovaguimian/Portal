import 'server-only';
import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';

import { environment } from '@/config/environment';
import { AuthError } from '@/errors/domainErrors';
import type { AppSession } from '@/models/auth';
import type { FirebaseAuthServiceInterface } from '@/services/auth/firebaseAuthServiceInterface';
import type { FirebaseAuthSession } from '@/services/auth/models/firebaseAuthSession';
import { getDemoState } from '@/services/demo/demoState';
import { resolveDemoSession } from '@/services/demo/resolveDemoSession';
import { strings } from '@/strings';

import type { ServerSession } from './models/serverSession';
import {
  decodeSession,
  encodeSession,
  sessionCookieName,
  sessionDuration,
} from './sessionCodec';

export class SessionService {

  private readonly refreshes = new Map<string, Promise<FirebaseAuthSession>>();
  constructor(
    private readonly auth: FirebaseAuthServiceInterface,
    private readonly demoMode = environment.demoMode
  ) {}

  // **************************************
  // MARK: - READ SERVER SESSION
  // **************************************

  async read(): Promise<ServerSession | null> {

    const token = (await cookies()).get(sessionCookieName)?.value;
    const session = token ? await decodeSession(token, this.demoMode) : null;
    return session?.demo ? resolveDemoSession(session) : session;

  }

  // **************************************
  // MARK: - READ PUBLIC SESSION
  // **************************************

  async publicSession(): Promise<AppSession | null> {

    const session = await this.read();
    return session ? this.toPublic(session) : null;

  }

  // **************************************
  // MARK: - PROJECT PUBLIC SESSION
  // **************************************

  toPublic(session: ServerSession): AppSession {

    return {
      user: session.user,
      expiresAt: new Date(session.auth.expiresAt).toISOString(),
    };

  }

  // **************************************
  // MARK: - CREATE SESSION COOKIE
  // **************************************

  async create(session: ServerSession) {

    const token = await encodeSession(
      session.demo
        ? {
          ...session,
          demoGeneration: session.demoGeneration ?? getDemoState().generation,
        }
        : session,
    );
    if (Buffer.byteLength(token) > 3800) { throw new AuthError(strings.auth.sessionTooLargeHint, 500); }
    (await cookies()).set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: sessionDuration,
      priority: 'high',
    });

  }

  // **************************************
  // MARK: - DELETE SESSION COOKIE
  // **************************************

  async delete() {
    (await cookies()).delete(sessionCookieName);
  }
  // Only call from Route Handlers or Server Actions: refresh writes Set-Cookie.

  // **************************************
  // MARK: - READ VALID SESSION
  // **************************************

  async valid(): Promise<ServerSession | null> {

    const session = await this.read();
    return session && session.auth.expiresAt - Date.now() <= 300000
      ? this.refresh(session)
      : session;

  }

  // **************************************
  // MARK: - REFRESH SERVER SESSION
  // **************************************

  async refresh(session: ServerSession): Promise<ServerSession | null> {

    const key = createHash('sha256')
      .update(session.auth.refreshToken)
      .digest('hex');
    let pending = this.refreshes.get(key);
    if (!pending) {

      pending = this.auth.refresh(session.auth);
      this.refreshes.set(key, pending);
      void pending
        .finally(() => {
          setTimeout(() => this.refreshes.delete(key), 5000).unref();
        })
        .catch(() => undefined);

    }
    try {

      const updated = { ...session, auth: await pending };
      await this.create(updated);
      return updated;

    } catch (error) {

      if (error instanceof AuthError && error.status === 401) {

        await this.delete();
        return null;

      }
      throw error;

    }

  }

}
