import 'server-only';
import { getContainer } from '@/container';
import { mapUserRoleTransport } from './mapUserRoleTransport';
import { environment } from '@/config/environment';
import { getDemoState } from '@/services/demo/demoState';
import { mapUserTransportToDomain } from '@/services/api/domainMappers';
import type { UserProfileTransport } from './models/userProfileTransport';
import type { FirebaseAuthSession } from './models/firebaseAuthSession';
import type { SessionUser } from '@/models/sessionUser';
import { AuthError } from '@/errors/domainErrors';

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
