import 'server-only'
import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { CompactEncrypt, compactDecrypt } from 'jose'
import { z } from 'zod'
import { ServerEnvironment } from '@/config/environment'
import type { FirebaseAuthServiceInterface } from '../auth/firebaseAuthServiceInterface'
import type { FirebaseAuthSession } from '../auth/models/firebaseAuthSession'
import type { SessionServiceInterface } from './sessionServiceInterface'

const SessionCookieName = 'portal_session'
const SessionDurationSeconds = 60 * 60 * 24 * 30
const RefreshThresholdMilliseconds = 5 * 60 * 1000

const FirebaseAuthSessionSchema = z.object({
  id_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  external_id: z.string(),
  email: z.string().email(),
})

export class SessionService implements SessionServiceInterface {

  private firebaseAuthService: FirebaseAuthServiceInterface

  constructor(firebaseAuthService: FirebaseAuthServiceInterface) {
    this.firebaseAuthService = firebaseAuthService
  }

  async createSession(session: FirebaseAuthSession): Promise<void> {

    const cookieStore = await cookies()
    const encryptedSession = await this.encryptSession(session)

    cookieStore.set(SessionCookieName, encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SessionDurationSeconds,
      path: '/',
      priority: 'high',
    })

  }

  async deleteSession(): Promise<void> {

    const cookieStore = await cookies()
    cookieStore.delete(SessionCookieName)

  }

  async getSession(): Promise<FirebaseAuthSession | null> {

    const encryptedSession = (await cookies()).get(SessionCookieName)?.value

    if (!encryptedSession) {
      return null
    }

    try {

      const { plaintext } = await compactDecrypt(encryptedSession, this.getEncryptionKey())
      const payload = JSON.parse(new TextDecoder().decode(plaintext))
      return FirebaseAuthSessionSchema.parse(payload)

    } catch {
      return null
    }

  }

  async getValidSession(): Promise<FirebaseAuthSession | null> {

    const session = await this.getSession()

    if (!session) {
      return null
    }

    if (session.expires_at - Date.now() > RefreshThresholdMilliseconds) {
      return session
    }

    try {

      const refreshedSession = await this.firebaseAuthService.refresh(session)
      await this.createSession(refreshedSession)
      return refreshedSession

    } catch {

      await this.deleteSession()
      return null

    }

  }

  private async encryptSession(session: FirebaseAuthSession): Promise<string> {

    return new CompactEncrypt(new TextEncoder().encode(JSON.stringify(session)))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.getEncryptionKey())

  }

  private getEncryptionKey(): Uint8Array {
    return createHash('sha256').update(ServerEnvironment.sessionSecret).digest()
  }

}
