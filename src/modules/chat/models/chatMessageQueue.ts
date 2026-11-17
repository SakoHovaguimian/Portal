import type { ChatMessageOperation } from './chatMessageOperation';
import type { ConversationMessage } from './conversationMessage';

export interface ChatMessageQueue {
  base: ConversationMessage;
  operations: ChatMessageOperation[];
  active: boolean;
}
