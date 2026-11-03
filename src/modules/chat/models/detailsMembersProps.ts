import type { ChatMember } from './chatMember';

export interface DetailsMembersProps {
  members: ChatMember[];
  userId: string;
  current?: ChatMember;
  canManage: boolean;
  busy: boolean;
  onChangeRole: (member: ChatMember) => void;
  onRemove: (member: ChatMember) => void;
}
