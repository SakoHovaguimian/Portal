import { z } from 'zod';
import { getContainer } from '@/container';
import { LoginInputSchema, SignupInputSchema } from '@/models/auth';
import {
  AuthError,
  NotFoundError,
  OwnershipError,
} from '@/errors/domainErrors';
import { getProfileSession } from '@/services/auth/profileSession';
import { errorResponse, trustedMutation } from '@/services/api/routeSafety';
import { strings } from '@/strings';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { createDemoIdentitySession } from '@/services/demo/demoIdentity';
import { DemoPresetSchema } from '@/services/demo/models/demoPreset';
import { getDemoState } from '@/services/demo/demoState';
import { getDemoOnboardingProgress } from '@/modules/onboarding/demo/onboardingState';
const InputSchema = z.discriminatedUnion('action', [
  LoginInputSchema.extend({ action: z.literal('login') }),
  SignupInputSchema.extend({ action: z.literal('signup') }),
  z.object({ action: z.literal('preset'), preset: DemoPresetSchema }).strict(),
]);
export async function POST(request: Request) {
  try {
    if (!trustedMutation(request))
      throw new OwnershipError(strings.errors.untrusted);
    const input = InputSchema.parse(await request.json());
    const runtime = await getEffectiveRuntime();
    const container = await getContainer();
    let session;
    if (input.action === 'preset') {
      if (!runtime.demoMode) throw new NotFoundError();
      session = await createDemoIdentitySession(input.preset);
    } else {
      const auth =
        input.action === 'signup'
          ? await container.firebaseAuthService.signUp(input)
          : await container.firebaseAuthService.signIn(
              input.email,
              input.password,
            );
      if (input.action === 'signup' && !runtime.demoMode)
        await container.apiClient.request('/users', auth.idToken, {
          method: 'POST',
          body: {
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            external_id: auth.externalId,
          },
        });
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
export async function GET() {
  try {
    const container = await getContainer();
    const session = await container.sessionService.valid();
    if (!session) throw new AuthError(strings.errors.sessionExpired);
    return Response.json(container.sessionService.toPublic(session), {
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PUT(request: Request) {
  try {
    if (!trustedMutation(request))
      throw new OwnershipError(strings.errors.untrusted);
    const container = await getContainer();
    const session = await container.sessionService.valid();
    if (!session) throw new AuthError(strings.errors.sessionExpired);
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
