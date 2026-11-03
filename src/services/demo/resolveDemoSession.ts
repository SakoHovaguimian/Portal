import 'server-only';
import type { ServerSession } from '@/services/session/models/serverSession';
import { getDemoState } from './demoState';

/** Proxy navigation and API sessions must agree after reset or account changes. */
export function resolveDemoSession(
  session: ServerSession,
): ServerSession | null {
  const state = getDemoState();
  const user = state.users.find(
    (candidate) =>
      candidate.id === session.user.id &&
      candidate.external_id === session.auth.externalId,
  );
  if (
    !user ||
    user.disabled ||
    user.deleted ||
    session.demoGeneration !== state.generation
  )
    return null;
  return {
    ...session,
    user: {
      id: user.id,
      externalId: user.external_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    },
  };
}
