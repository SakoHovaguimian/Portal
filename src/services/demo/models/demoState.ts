import type { FeatureRequestTransport } from '@/services/api/models';

import type { DemoPasswordRecord } from './demoPasswordRecord';
import type { DemoUser } from './demoUser';

export interface DemoState {
  generation: string;
  users: DemoUser[];
  featureRequests: FeatureRequestTransport[];
  credentials: Map<string, DemoPasswordRecord>;
  refreshTokens: Map<string, string>;
}
