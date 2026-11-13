import 'server-only';

import { enabledPortalModules } from '@/config/portalModuleRegistry';
import type { ServerSession } from '@/services/session/models/serverSession';

import type { BackendForward } from './models/backendForward';

// **************************************
// MARK: - PROXY OPTIONAL FEATURE REQUEST
// **************************************

export async function featureBackendProxy(
  request: Request,
  path: string,
  session: ServerSession,
  forward: BackendForward,
) {

  for (const { live } of enabledPortalModules) {

    if (!live) { continue; }
    const response = await live(request, path, session, forward);
    if (response) { return response; }

  }
  return null;

}
