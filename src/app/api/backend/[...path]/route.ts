import type { BackendRouteContext } from '@/models/backendRouteContext';
import { NextRequest } from 'next/server';
import { getContainer } from '@/container';
import {
  AuthError,
  DomainError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import { strings, portalIntegrationStrings } from '@/strings';
import { errorResponse, trustedMutation } from '@/services/api/routeSafety';
import { requireModuleAvailability } from '@/services/api/moduleAvailability';
import { featureBackendProxy } from '@/services/api/featureBackendProxy';
import { portalModules } from '@/config/portalModules';
import { getDemoOnboardingProgress } from '@/modules/onboarding/demo/onboardingState';
import { getDemoState } from '@/services/demo/demoState';
import {
  enforceLiveOnboarding,
  isOnboardingRecoveryApiPath,
} from '@/modules/onboarding/server/enforceLiveOnboarding';

export const runtime = 'nodejs';

// **************************************
// MARK: - HANDLE AUTHENTICATED BACKEND REQUEST
// **************************************

async function handle(
  request: NextRequest,
  context: BackendRouteContext,
) {

  const container = await getContainer();
  try {

    if (!trustedMutation(request)) { throw new OwnershipError(strings.errors.untrusted); }
    const { path } = await context.params;
    if (
      path.some(
        (segment) =>
          !segment ||
          segment === '.' ||
          segment === '..' ||
          /[\\/]/.test(segment),
      )
    ) { throw new ValidationError(strings.errors.invalidPath); }
    const session = await container.sessionService.valid();
    if (!session) { throw new AuthError(strings.errors.sessionExpired); }
    const upstreamPath = `/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
    requireModuleAvailability(upstreamPath);
    if (container.demoMode) {

      const current = getDemoState().users.find(
        (user) => user.id === session.user.id,
      );
      const recovery = isOnboardingRecoveryApiPath(
        upstreamPath,
        session.user.id,
      );
      if (
        portalModules.onboarding &&
        current &&
        !recovery &&
        !getDemoOnboardingProgress(current).completedAt
      ) {

        throw new DomainError(
          portalIntegrationStrings.onboardingRequiredDescription,
          'ONBOARDING_REQUIRED',
          403,
        );

      }
      const response = await container.demoApiClient.proxy(
        request,
        upstreamPath,
        session,
      );
      if (
        request.method === 'DELETE' &&
        path.join('/') === 'portal/account-tools/account' &&
        response.ok
      ) { await container.sessionService.delete(); }
      return response;

    }
    let activeSession = session;
    let refreshedOnce = false;

    // **************************************
    // MARK: - FORWARD BACKEND REQUEST WITH SESSION REFRESH
    // **************************************

    const forward = async (input: Request, target: string) => {

      const retry = input.clone();
      const response = await container.apiClient.proxy(
        input,
        target,
        activeSession.auth.idToken,
      );
      if (response.status !== 401 || refreshedOnce) { return response; }
      refreshedOnce = true;
      const refreshed = await container.sessionService.refresh(activeSession);
      if (!refreshed) { return response; }
      activeSession = refreshed;
      await response.body?.cancel();
      const result = await container.apiClient.proxy(
        retry,
        target,
        refreshed.auth.idToken,
      );
      if (result.status === 401) { await container.sessionService.delete(); }
      return result;

    };
    await enforceLiveOnboarding(request, upstreamPath, session, forward);
    const response =
      (await featureBackendProxy(request, upstreamPath, session, forward)) ??
      (await forward(request, upstreamPath));
    if (
      request.method === 'DELETE' &&
      path.join('/') === 'portal/account-tools/account' &&
      response.ok
    ) { await container.sessionService.delete(); }
    return response;

  } catch (error) {

    if (error instanceof AuthError && error.status === 401) { await container.sessionService.delete(); }
    return errorResponse(error);

  }

}

// **************************************
// MARK: - HANDLE BACKEND GET REQUEST
// **************************************

export const GET = handle;

// **************************************
// MARK: - HANDLE BACKEND POST REQUEST
// **************************************

export const POST = handle;

// **************************************
// MARK: - HANDLE BACKEND PATCH REQUEST
// **************************************

export const PATCH = handle;

// **************************************
// MARK: - HANDLE BACKEND PUT REQUEST
// **************************************

export const PUT = handle;

// **************************************
// MARK: - HANDLE BACKEND DELETE REQUEST
// **************************************

export const DELETE = handle;
