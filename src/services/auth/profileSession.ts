import 'server-only';
import { environment } from '@/config/environment';
import { getContainer } from '@/container';
import { AuthError } from '@/errors/domainErrors';
import type { SessionUser } from '@/models/sessionUser';
import { mapUserTransportToDomain } from '@/services/api/domainMappers';
import { getDemoState } from '@/services/demo/demoState';

import { mapUserRoleTransport } from './mapUserRoleTransport';
import type { FirebaseAuthSession } from './models/firebaseAuthSession';
import type { UserProfileTransport } from './models/userProfileTransport';

// **************************************
// MARK: - GET AUTHENTICATED PROFILE SESSION
// **************************************

export async function getProfileSession(
  auth: FirebaseAuthSession,
  demoMode = environment.demoMode,
): Promise<SessionUser> {

  const transport = demoMode
    ? getDemoState().users.find((user) => user.external_id === auth.externalId)
    : await (
      await getContainer()
    ).apiClient.request<
        UserProfileTransport
      >('/users/profile', auth.idToken);
  if (
    !transport ||
    transport.deleted ||
    ('disabled' in transport && transport.disabled)
  ) { throw new AuthError(); }
  const user = mapUserTransportToDomain(transport);
  return {
    id: user.id,
    externalId: user.externalId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: mapUserRoleTransport(
      'role' in transport ? transport.role : undefined,
    ),
  };

}
