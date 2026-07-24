import { strings } from '@/content/strings'
import 'server-only'
import { z } from 'zod'
import { ServerEnvironment } from '@/config/environment'
import type { FirebaseAuthServiceInterface } from './firebaseAuthServiceInterface'
import type { FirebaseAuthSession, FirebaseSignUpInput } from './models/firebaseAuthSession'

const FirebaseAuthResponseSchema = z.object({
  idToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.coerce.number(),
  localId: z.string(),
  email: z.string().email(),
})

const FirebaseRefreshResponseSchema = z.object({
  id_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.coerce.number(),
  user_id: z.string(),
})

const FirebaseErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
})

export class FirebaseAuthServiceError extends Error {

  readonly code: string

  constructor(code: string) {

    super(getFriendlyFirebaseErrorMessage(code))
    this.name = 'FirebaseAuthServiceError'
    this.code = code

  }

}

export class FirebaseAuthService implements FirebaseAuthServiceInterface {

  async signIn(email: string, password: string): Promise<FirebaseAuthSession> {

    const response = await this.callIdentityEndpoint('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    })
    const result = FirebaseAuthResponseSchema.parse(response)

    return this.mapAuthResponseToSession(result)

  }

  async signUp(input: FirebaseSignUpInput): Promise<FirebaseAuthSession> {

    const response = await this.callIdentityEndpoint('accounts:signUp', {
      email: input.email,
      password: input.password,
      returnSecureToken: true,
    })
    const result = FirebaseAuthResponseSchema.parse(response)

    return this.mapAuthResponseToSession(result)

  }

  async refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession> {

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: session.refresh_token,
    })
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(ServerEnvironment.firebaseWebApiKey)}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body,
        cache: 'no-store',
      },
    )
    const payload = await response.json()

    if (!response.ok) {
      throw this.createFirebaseError(payload)
    }

    const result = FirebaseRefreshResponseSchema.parse(payload)

    return {
      id_token: result.id_token,
      refresh_token: result.refresh_token,
      expires_at: Date.now() + (result.expires_in * 1000),
      external_id: result.user_id,
      email: session.email,
    }

  }

  async deleteUser(idToken: string): Promise<void> {

    await this.callIdentityEndpoint('accounts:delete', {
      idToken,
    })

  }

  async sendPasswordResetEmail(email: string): Promise<void> {

    await this.callIdentityEndpoint('accounts:sendOobCode', {
      requestType: 'PASSWORD_RESET',
      email,
    })

  }

  private async callIdentityEndpoint(endpoint: string, body: Record<string, unknown>): Promise<unknown> {

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(ServerEnvironment.firebaseWebApiKey)}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      },
    )
    const payload = await response.json()

    if (!response.ok) {
      throw this.createFirebaseError(payload)
    }

    return payload

  }

  private createFirebaseError(payload: unknown): FirebaseAuthServiceError {

    const result = FirebaseErrorSchema.safeParse(payload)
    return new FirebaseAuthServiceError(result.success ? result.data.error.message : 'AUTHENTICATION_FAILED')

  }

  private mapAuthResponseToSession(response: z.infer<typeof FirebaseAuthResponseSchema>): FirebaseAuthSession {

    return {
      id_token: response.idToken,
      refresh_token: response.refreshToken,
      expires_at: Date.now() + (response.expiresIn * 1000),
      external_id: response.localId,
      email: response.email,
    }

  }

}

function getFriendlyFirebaseErrorMessage(code: string): string {

  const normalizedCode = code.split(' : ')[0]
  const messages: Record<string, string> = {
    EMAIL_EXISTS: strings.auth.firebase.accountExists,
    EMAIL_NOT_FOUND: strings.auth.firebase.noAccount,
    INVALID_EMAIL: strings.shared.enterAValidEmailAddress,
    INVALID_LOGIN_CREDENTIALS: strings.shared.theEmailOrPasswordIsIncorrect,
    INVALID_PASSWORD: strings.shared.theEmailOrPasswordIsIncorrect,
    MISSING_PASSWORD: strings.shared.enterYourPassword,
    OPERATION_NOT_ALLOWED: strings.auth.firebase.emailDisabled,
    TOO_MANY_ATTEMPTS_TRY_LATER: strings.auth.firebase.tooMany,
    USER_DISABLED: strings.auth.firebase.disabled,
    WEAK_PASSWORD: strings.auth.firebase.weakPassword,
  }

  return messages[normalizedCode] ?? strings.auth.firebase.failed

}
