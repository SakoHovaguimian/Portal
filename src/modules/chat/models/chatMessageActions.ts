import type { ChatReactionEmoji } from './chatReaction';
import type { ConversationMessage } from './conversationMessage';

export interface ChatMessageActions {
  projections: Record<string, ConversationMessage>;
  failedIds: string[];
  busyIds: string[];
  react: (message: ConversationMessage, emoji: ChatReactionEmoji) => void;
  pin: (message: ConversationMessage, pinned: boolean) => void;
  edit: (message: ConversationMessage, body: string) => Promise<ConversationMessage>;
  remove: (message: ConversationMessage) => Promise<ConversationMessage>;
}
