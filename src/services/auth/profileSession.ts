import 'server-only';
import { container } from '@/container';
import { environment } from '@/config/environment';
import { getDemoState } from '@/services/demo/demoState';
import { mapUserTransportToDomain } from '@/services/api/domainMappers';
import type { UserTransport } from '@/services/api/models';
import type { FirebaseAuthSession } from './models/firebaseAuthSession';
import type { SessionUser } from '@/models/sessionUser';
import { AuthError } from '@/errors/domainErrors';
export async function getProfileSession(
  auth: FirebaseAuthSession,
): Promise<SessionUser> {
  const transport = environment.demoMode
    ? getDemoState().users.find((user) => user.external_id === auth.externalId)
    : await container.apiClient.request<UserTransport>(
        '/users/profile',
        auth.idToken,
      );
  if (!transport) throw new AuthError();
  const user = mapUserTransportToDomain(transport);
  return {
    id: user.id,
    externalId: user.externalId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: 'user',
  };
}
