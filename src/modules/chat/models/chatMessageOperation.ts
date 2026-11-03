import type { ConversationMessage } from './conversationMessage';
import type { ChatMessageAction } from './chatMessageAction';

export interface ChatMessageOperation {
  action: ChatMessageAction;
  resolve: (message: ConversationMessage) => void;
  reject: (error: unknown) => void;
}
