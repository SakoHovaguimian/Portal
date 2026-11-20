import 'server-only';

import { environment } from '@/config/environment';
import { AuthError, ApiError } from '@/errors/domainErrors';
import type { SignupInput } from '@/models/auth';
import { strings } from '@/strings';

import type { FirebaseAuthServiceInterface } from './firebaseAuthServiceInterface';
import { AuthErrorResponseSchema } from './models/authErrorResponse';
import { AuthResponseSchema } from './models/authResponse';
import type { FirebaseAuthSession } from './models/firebaseAuthSession';
import { RefreshResponseSchema } from './models/refreshResponse';

const invalidRefreshCredentials = new Set([
  'INVALID_REFRESH_TOKEN',
  'TOKEN_EXPIRED',
  'USER_DISABLED',
  'USER_NOT_FOUND',
]);

export class FirebaseAuthService implements FirebaseAuthServiceInterface {

  // **************************************
  // MARK: - SIGN IN WITH FIREBASE
  // **************************************

  async signIn(email: string, password: string) {

    return this.authenticate('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

  }

  // **************************************
  // MARK: - CREATE FIREBASE ACCOUNT
  // **************************************

  async signUp(input: SignupInput) {

    return this.authenticate('accounts:signUp', {
      email: input.email,
      password: input.password,
      displayName: `${input.firstName} ${input.lastName}`,
      returnSecureToken: true,
    });

  }

  // **************************************
  // MARK: - AUTHENTICATE FIREBASE REQUEST
  // **************************************

  private async authenticate(
    endpoint: string,
    body: Record<string, unknown>,
  ): Promise<FirebaseAuthSession> {

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(environment.firebaseApiKey)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      },
    );
    const result = AuthResponseSchema.parse(await this.parse(response));
    return {
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      externalId: result.localId,
      email: result.email,
      expiresAt: Date.now() + result.expiresIn * 1000,
    };

  }

  // **************************************
  // MARK: - REFRESH FIREBASE SESSION
  // **************************************

  async refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession> {

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(environment.firebaseApiKey)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: session.refreshToken,
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      },
    );
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {

      const error = AuthErrorResponseSchema.safeParse(payload);
      const code = error.success ? error.data.error.message.split(' : ')[0] : '';
      if ([400, 401, 403].includes(response.status) &&
        invalidRefreshCredentials.has(code)) { throw new AuthError(strings.errors.sessionExpired); }
      throw new ApiError(strings.errors.unavailable, 503);

    }
    const result = RefreshResponseSchema.safeParse(payload);
    if (!result.success || result.data.user_id !== session.externalId) { throw new ApiError(strings.errors.unavailable, 503); }
    return {
      ...session,
      idToken: result.data.id_token,
      refreshToken: result.data.refresh_token,
      expiresAt: Date.now() + result.data.expires_in * 1000,
    };

  }

  // **************************************
  // MARK: - PARSE FIREBASE AUTH RESPONSE
  // **************************************

  private async parse(response: Response): Promise<unknown> {

    const payload = await response.json();
    if (response.ok) { return payload; }
    if (response.status >= 500) { throw new ApiError(strings.errors.unavailable, 503); }
    const code = AuthErrorResponseSchema.safeParse(payload);
    const key = code.success ? code.data.error.message.split(' : ')[0] : '';
    const messages: Record<string, string> = {
      EMAIL_EXISTS: strings.auth.emailExistsHint,
      INVALID_EMAIL: strings.auth.invalidEmailHint,
      USER_DISABLED: strings.auth.disabledHint,
      TOO_MANY_ATTEMPTS_TRY_LATER: strings.auth.tooManyHint,
      WEAK_PASSWORD: strings.auth.passwordHint,
    };
    throw new AuthError(
      messages[key] || strings.auth.invalidCredentialsHint,
      key === 'EMAIL_EXISTS' ? 409 : 401,
    );

  }

}
