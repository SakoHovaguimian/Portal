import type { ServerSession } from '@/services/session/models/serverSession';

import type { BackendForward } from './backendForward';

export type FeatureBackendHandler = (
  request: Request,
  path: string,
  session: ServerSession,
  forward: BackendForward,
) => Promise<Response | null>;
