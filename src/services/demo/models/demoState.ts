import type {
  UserTransport,
  FeatureRequestTransport,
} from '@/services/api/models';
import type { ChatMessage } from '@/modules/chat/models/chatMessage';
export interface DemoState {
  users: UserTransport[];
  featureRequests: FeatureRequestTransport[];
  messages: ChatMessage[];
  credentials: Map<string, { salt: string; hash: string }>;
  refreshTokens: Map<string, string>;
}
