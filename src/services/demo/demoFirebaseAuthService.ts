import 'server-only';
import { AuthError } from '@/errors/domainErrors';
import type { SignupInput } from '@/models/auth';
import type { FirebaseAuthServiceInterface } from '@/services/auth/firebaseAuthServiceInterface';
import type { FirebaseAuthSession } from '@/services/auth/models/firebaseAuthSession';
import { strings } from '@/strings';

import { createDemoOnboarding } from '@/modules/onboarding/demo/onboardingState';
import { getDemoState, passwordMatches, passwordRecord } from './demoState';

export class DemoFirebaseAuthService implements FirebaseAuthServiceInterface {

  // **************************************
  // MARK: - SIGN IN TO DEMO ACCOUNT
  // **************************************

  async signIn(email: string, password: string): Promise<FirebaseAuthSession> {

    const state = getDemoState();
    const user = state.users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
    );
    const credential = user && state.credentials.get(user.external_id);
    if (
      !user ||
      user.disabled ||
      user.deleted ||
      !credential ||
      !passwordMatches(password, credential)
    ) { throw new AuthError(strings.auth.invalidCredentialsHint); }
    return this.session(user.external_id, user.email);

  }

  // **************************************
  // MARK: - CREATE DEMO ACCOUNT
  // **************************************

  async signUp(input: SignupInput): Promise<FirebaseAuthSession> {

    const state = getDemoState();
    const email = input.email.trim().toLowerCase();
    if (state.users.some((user) => user.email.toLowerCase() === email)) { throw new AuthError(strings.auth.emailExistsHint, 409); }
    const now = new Date().toISOString();
    const user = {
      id: crypto.randomUUID(),
      external_id: crypto.randomUUID(),
      first_name: input.firstName,
      last_name: input.lastName,
      email,
      phone_number: null,
      date_of_birth: null,
      created_at: now,
      updated_at: now,
      deleted: false,
      disabled: false,
      role: 'user' as const,
    };
    state.users.push(user);
    createDemoOnboarding(user);
    state.credentials.set(user.external_id, passwordRecord(input.password));
    return this.session(user.external_id, email);

  }

  // **************************************
  // MARK: - REFRESH DEMO SESSION
  // **************************************

  async refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession> {

    const state = getDemoState();
    const user = state.users.find(
      (user) => user.external_id === session.externalId,
    );
    if (
      !user ||
      user.disabled ||
      user.deleted ||
      state.refreshTokens.get(session.refreshToken) !== session.externalId
    ) { throw new AuthError(strings.errors.sessionExpired); }
    state.refreshTokens.delete(session.refreshToken);
    return this.session(session.externalId, session.email);

  }

  // **************************************
  // MARK: - CREATE DEMO AUTH SESSION
  // **************************************

  private session(externalId: string, email: string): FirebaseAuthSession {

    const refreshToken = crypto.randomUUID();
    getDemoState().refreshTokens.set(refreshToken, externalId);
    return {
      idToken: crypto.randomUUID(),
      refreshToken,
      externalId,
      email,
      expiresAt: Date.now() + 3600000,
    };

  }

}
