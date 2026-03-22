import { SignJWT, jwtVerify } from 'jose';
import { AppSessionSchema, type AppSession } from '@semantic-web/core';
import { appEnv } from './env';

const encoder = new TextEncoder();
const cookieSecret = encoder.encode(appEnv.sessionSecret);

export async function signSessionCookie(session: AppSession): Promise<string> {
  const expiresAtSeconds = Math.floor(new Date(session.expiresAt).getTime() / 1000);

  return new SignJWT({ session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAtSeconds)
    .sign(cookieSecret);
}

export async function verifySessionCookie(token: string): Promise<AppSession> {
  const verified = await jwtVerify(token, cookieSecret);
  return AppSessionSchema.parse(verified.payload.session);
}
