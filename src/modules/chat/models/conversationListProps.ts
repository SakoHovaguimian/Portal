import type { ChatConversation } from './chatConversation';

export interface ConversationListProps {
  conversations: ChatConversation[];
  selectedId: string | null;
  search: string;
  archived: boolean;
  onSearch: (value: string) => void;
  onArchived: (value: boolean) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
}
