import 'server-only';
import { createHash } from 'node:crypto';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { environment } from '@/config/environment';
import {
  ServerSessionSchema,
  type ServerSession,
} from './models/serverSession';
export const sessionCookieName = 'portal_session';
export const sessionDuration = 60 * 60 * 24 * 30;
const key = () =>
  createHash('sha256').update(environment.sessionSecret).digest();
export async function encodeSession(session: ServerSession) {
  return new EncryptJWT({ session })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .encrypt(key());
}
export async function decodeSession(
  token: string,
): Promise<ServerSession | null> {
  try {
    const { payload } = await jwtDecrypt(token, key(), {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    });
    const session = ServerSessionSchema.parse(payload.session);
    return session.demo === environment.demoMode ? session : null;
  } catch {
    return null;
  }
}
