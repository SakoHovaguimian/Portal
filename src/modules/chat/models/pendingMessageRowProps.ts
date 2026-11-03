import type { PendingChatMessage } from './pendingChatMessage';
import type { ConversationMessage } from './conversationMessage';

export interface PendingMessageRowProps {
  item: PendingChatMessage;
  author: string;
  reply?: ConversationMessage;
  onRetry: () => void;
}
