import type { ChatMessageActions } from './chatMessageActions';
import type { ChatConversation } from './chatConversation';
import type { ConversationMessage } from './conversationMessage';
import type { ChatDraft } from './chatDraft';
import type { PendingChatMessage } from './pendingChatMessage';

export interface ConversationThreadProps {
  conversation: ChatConversation;
  actions: ChatMessageActions;
  messages: ConversationMessage[];
  userId: string;
  draft: ChatDraft;
  onDraft: (draft: ChatDraft) => void;
  outbox: PendingChatMessage[];
  onSend: (draft: ChatDraft) => void;
  onBack: () => void;
  onDetails: () => void;
  demoMode: boolean;
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
}
