import type { ConversationMessage } from './conversationMessage';
import type { ChatMessageOperation } from './chatMessageOperation';

export interface ChatMessageQueue {
  base: ConversationMessage;
  operations: ChatMessageOperation[];
  active: boolean;
}
