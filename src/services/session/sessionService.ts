import 'server-only';
import { setTimeout as delay } from 'node:timers/promises';
import { cookies } from 'next/headers';

import { environment } from '@/config/environment';
import { ApiError, AuthError } from '@/errors/domainErrors';
import type { AppSession } from '@/models/auth';
import type { SessionUser } from '@/models/sessionUser';
import type { FirebaseAuthServiceInterface } from '@/services/auth/firebaseAuthServiceInterface';
import type { FirebaseAuthSession } from '@/services/auth/models/firebaseAuthSession';
import { getDemoState } from '@/services/demo/demoState';
import { resolveDemoSession } from '@/services/demo/resolveDemoSession';
import { strings } from '@/strings';

import type { ActiveSession } from './models/activeSession';
import { ServerSessionSchema, type ServerSession } from './models/serverSession';
import {
  createSessionToken,
  decodeSession,
  encodeSession,
  readSessionKey,
  sessionCookieName,
  sessionDuration,
} from './sessionCodec';
import { SessionStore } from './sessionStore';

const refreshLeaseDuration = 20000;
const refreshWaitDuration = 16000;

export class SessionService {

  private readonly refreshes = new Map<string, Promise<ActiveSession | null>>();
  private readonly store: SessionStore;

  constructor(
    private readonly auth: FirebaseAuthServiceInterface,
    private readonly demoMode = environment.demoMode
  ) { this.store = new SessionStore(demoMode); }

  // **************************************
  // MARK: - READ SERVER SESSION
  // **************************************

  async read(token?: string): Promise<ActiveSession | null> {

    const key = readSessionKey(token ?? (await cookies()).get(sessionCookieName)?.value);
    return key ? this.readByKey(key) : null;

  }

  // **************************************
  // MARK: - READ STORED SESSION BY KEY
  // **************************************

  private async readByKey(key: string): Promise<ActiveSession | null> {

    const record = this.store.read(key);
    if (!record) { return null; }
    const decoded = await decodeSession(record.payload, key, this.demoMode);
    const session = decoded?.demo ? resolveDemoSession(decoded) : decoded;
    return session ? { ...session, key, record } : null;

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

    const { token, key } = createSessionToken();
    const expiresAt = Date.now() + sessionDuration * 1000;
    const data = session.demo
      ? { ...session, demoGeneration: session.demoGeneration ?? getDemoState().generation }
      : session;
    const payload = await encodeSession(data, key, expiresAt);
    const cookieStore = await cookies();
    const previousKey = readSessionKey(cookieStore.get(sessionCookieName)?.value);
    this.store.create(key, { expiresAt, payload }, previousKey);
    cookieStore.set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresAt),
      priority: 'high',
    });

  }

  // **************************************
  // MARK: - DELETE SESSION COOKIE
  // **************************************

  async delete() {

    const cookieStore = await cookies();
    const key = readSessionKey(cookieStore.get(sessionCookieName)?.value);
    if (key) { this.store.delete(key); }
    cookieStore.delete(sessionCookieName);

  }

  // **************************************
  // MARK: - READ VALID SESSION
  // **************************************

  async valid(): Promise<ActiveSession | null> {

    const session = await this.read();
    return session && session.auth.expiresAt - Date.now() <= 300000
      ? this.refresh(session)
      : session;

  }

  // **************************************
  // MARK: - UPDATE SESSION PROFILE
  // **************************************

  async updateProfile(session: ActiveSession, user: SessionUser) {
    return this.updateSession(session.key, { user });
  }

  // **************************************
  // MARK: - REFRESH SERVER SESSION
  // **************************************

  async refresh(session: ActiveSession): Promise<ActiveSession | null> {

    const current = this.refreshes.get(session.key);
    if (current) { return current; }
    const pending = this.refreshStoredSession(session);
    this.refreshes.set(session.key, pending);
    try {
      return await pending;
    } finally {
      this.refreshes.delete(session.key);
    }

  }

  // **************************************
  // MARK: - COORDINATE REFRESH WITH SESSION STORE
  // **************************************

  private async refreshStoredSession(session: ActiveSession): Promise<ActiveSession | null> {

    const deadline = Date.now() + refreshWaitDuration;
    while (Date.now() < deadline) {

      const current = await this.readByKey(session.key);
      if (!current || current.auth.expiresAt !== session.auth.expiresAt ||
        current.auth.idToken !== session.auth.idToken ||
        current.auth.refreshToken !== session.auth.refreshToken) { return current; }

      const now = Date.now();
      const lease = now + refreshLeaseDuration;
      if (this.store.claimRefresh(current.key, current.record.payload, now, lease)) {

        try {
          return await this.refreshWithLease(current, lease);
        } finally {
          this.store.releaseRefresh(current.key, lease);
        }

      }
      await delay(100);

    }
    throw new ApiError(strings.errors.unavailable, 503);

  }

  // **************************************
  // MARK: - REPLACE FIREBASE CREDENTIALS OR REVOKE SESSION
  // **************************************

  private async refreshWithLease(session: ActiveSession, lease: number) {

    let auth: FirebaseAuthSession;
    try {
      auth = await this.auth.refresh(session.auth);
    } catch (error) {

      if (!(error instanceof AuthError) || error.status !== 401) { throw error; }
      if (this.store.delete(session.key, lease)) { return null; }
      return this.readByKey(session.key);

    }
    return this.updateSession(session.key, { auth }, lease);

  }

  // **************************************
  // MARK: - MERGE SESSION UPDATE WITHOUT RECREATING REVOKED RECORDS
  // **************************************

  private async updateSession(
    key: string,
    changes: Partial<Pick<ServerSession, 'auth' | 'user'>>,
    lease?: number,
  ): Promise<ActiveSession | null> {

    for (let attempt = 0; attempt < 4; attempt += 1) {

      const current = await this.readByKey(key);
      if (!current) { return null; }
      const { expiresAt, payload: previousPayload } = current.record;
      const updated = { ...current, ...changes };
      const payload = await encodeSession(ServerSessionSchema.parse(updated), key, expiresAt);
      if (this.store.update(key, previousPayload, payload, lease)) { return { ...updated, record: { expiresAt, payload } }; }

    }
    throw new ApiError(strings.errors.unavailable, 503);

  }

}
