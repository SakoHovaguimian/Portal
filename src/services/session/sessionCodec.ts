import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { EncryptJWT, jwtDecrypt } from 'jose';

import { environment, getSessionSecret } from '@/config/environment';

import {
  ServerSessionSchema,
  type ServerSession,
} from './models/serverSession';

export const sessionCookieName = 'portal_session';

export const sessionDuration = 60 * 60 * 24 * 30;

// **************************************
// MARK: - HASH OPAQUE SESSION TOKEN
// **************************************

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

// **************************************
// MARK: - CREATE OPAQUE SESSION TOKEN
// **************************************

export function createSessionToken() {

  const token = randomBytes(32).toString('base64url');
  return { token, key: hashSessionToken(token) };

}

// **************************************
// MARK: - READ OPAQUE SESSION KEY
// **************************************

export function readSessionKey(token: string | undefined) {

  return token && /^[A-Za-z0-9_-]{43}$/.test(token)
    ? hashSessionToken(token)
    : null;

}

// **************************************
// MARK: - DERIVE SESSION ENCRYPTION KEY
// **************************************

const key = (demoMode: boolean) =>
  createHash('sha256').update(getSessionSecret(demoMode)).digest();

// **************************************
// MARK: - ENCODE SERVER SESSION
// **************************************

export async function encodeSession(session: ServerSession, sessionId: string, expiresAt: number) {

  return new EncryptJWT({ session })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAudience(sessionId)
    .setExpirationTime(Math.ceil(expiresAt / 1000))
    .encrypt(key(session.demo));

}

// **************************************
// MARK: - DECODE SERVER SESSION
// **************************************

export async function decodeSession(
  encryptedSession: string,
  sessionId: string,
  demoMode = environment.demoMode,
): Promise<ServerSession | null> {

  const encryptionKey = key(demoMode);
  try {

    const { payload } = await jwtDecrypt(encryptedSession, encryptionKey, {
      audience: sessionId,
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    });
    const session = ServerSessionSchema.parse(payload.session);
    return session.demo === demoMode ? session : null;

  } catch {
    return null;
  }

}
