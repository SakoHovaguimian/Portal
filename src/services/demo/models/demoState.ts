import type { FeatureRequestTransport } from '@/services/api/models';
import type { DemoUser } from './demoUser';
import type { DemoPasswordRecord } from './demoPasswordRecord';
import type { ChatMessage } from '@/modules/chat/models/chatMessage';

export interface DemoState {
  generation: string;
  users: DemoUser[];
  featureRequests: FeatureRequestTransport[];
  messages: ChatMessage[];
  credentials: Map<string, DemoPasswordRecord>;
  refreshTokens: Map<string, string>;
}
