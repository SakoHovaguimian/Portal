import type { ChatPerson } from './chatPerson';

export interface CreateConversationDialogProps {
  people: ChatPerson[];
  onDismiss: () => void;
  onCreated: (id: string) => void;
}
