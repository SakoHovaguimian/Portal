import { getContainer } from '@/container';
import {
  AuthError,
  NotFoundError,
  OwnershipError,
} from '@/errors/domainErrors';
import { errorResponse, trustedMutation } from '@/services/api/routeSafety';
import { getProfileSession } from '@/services/auth/profileSession';
import { createDemoIdentitySession } from '@/services/demo/demoIdentity';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { getDemoState } from '@/services/demo/demoState';
import { SessionActionInputSchema } from '@/services/session/models/sessionActionInput';
import { strings } from '@/strings';

import { getDemoOnboardingProgress } from '@/modules/onboarding/demo/onboardingState';

// **************************************
// MARK: - AUTHENTICATE ACCOUNT SESSION
// **************************************

export async function POST(request: Request) {

  try {

    if (!trustedMutation(request)) { throw new OwnershipError(strings.errors.untrusted); }
    const input = SessionActionInputSchema.parse(await request.json());
    const runtime = await getEffectiveRuntime();
    const container = await getContainer();
    let session;
    if (input.action === 'preset') {

      if (!runtime.demoMode) { throw new NotFoundError(); }
      session = await createDemoIdentitySession(input.preset);

    } else {

      const auth =
        input.action === 'signup'
          ? await container.firebaseAuthService.signUp(input)
          : await container.firebaseAuthService.signIn(
            input.email,
            input.password,
          );
      if (input.action === 'signup' && !runtime.demoMode) {

        await container.apiClient.request('/users', auth.idToken, {
          method: 'POST',
          body: {
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            external_id: auth.externalId,
          },
        });

      }
      session = {
        auth,
        user: await getProfileSession(auth, runtime.demoMode),
        demo: runtime.demoMode,
      };

    }
    await container.sessionService.create(session);
    const current = runtime.demoMode
      ? getDemoState().users.find((user) => user.id === session.user.id)
      : null;
    return Response.json(
      {
        ...container.sessionService.toPublic(session),
        onboardingRequired:
          runtime.onboardingEnabled && current
            ? !getDemoOnboardingProgress(current).completedAt
            : false,
      },
      { headers: { 'cache-control': 'no-store' } },
    );

  } catch (error) {
    return errorResponse(error);
  }

}

// **************************************
// MARK: - GET CURRENT PUBLIC SESSION
// **************************************

export async function GET() {

  try {

    const container = await getContainer();
    const session = await container.sessionService.valid();
    if (!session) { throw new AuthError(strings.errors.sessionExpired); }
    return Response.json(container.sessionService.toPublic(session), {
      headers: { 'cache-control': 'no-store' },
    });

  } catch (error) {
    return errorResponse(error);
  }

}

// **************************************
// MARK: - REFRESH SESSION PROFILE
// **************************************

export async function PUT(request: Request) {

  try {

    if (!trustedMutation(request)) { throw new OwnershipError(strings.errors.untrusted); }
    const container = await getContainer();
    const session = await container.sessionService.valid();
    if (!session) { throw new AuthError(strings.errors.sessionExpired); }
    const updated = {
      ...session,
      user: await getProfileSession(session.auth, session.demo),
    };
    await container.sessionService.create(updated);
    return Response.json(container.sessionService.toPublic(updated), {
      headers: { 'cache-control': 'no-store' },
    });

  } catch (error) {
    return errorResponse(error);
  }

}
