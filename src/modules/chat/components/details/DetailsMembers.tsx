import { Avatar, Badge, IconMenu } from '@/components/ui';
import type { IconMenuItem } from '@/components/ui/models/iconMenuItem';
import { portalChatStrings as copy } from '@/strings';

import type { ChatMember } from '../../models/chatMember';
import type { DetailsMembersProps } from '../../models/detailsMembersProps';

export function DetailsMembers({ members, userId, current, canManage, busy, onChangeRole, onRemove }: DetailsMembersProps) {

  function renderMember(member: ChatMember) {

    const manageable = canManage && member.id !== userId && member.role !== 'owner' && (current?.role === 'owner' || member.role === 'member');
    const actions: IconMenuItem<'role' | 'remove'>[] = [];
    if (current?.role === 'owner') {
      actions.push({ id: 'role', label: member.role === 'admin' ? copy.makeMember : copy.makeAdmin, icon: 'user' });
    }
    actions.push({ id: 'remove', label: copy.removeMember, icon: 'trash', intent: 'danger' });
    return (
      <li key={member.id} className="flex min-w-0 items-center gap-3 py-3">
        <Avatar name={member.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="m-0 min-w-0 text-sm font-semibold text-primary wrap-anywhere">{member.name}</p>
            {member.id === userId && <Badge>{copy.you}</Badge>}
          </div>
          <p className="m-0 mt-1 text-xs text-tertiary">{copy[member.role]}</p>
        </div>
        {manageable && (
          <IconMenu
            label={copy.memberActions(member.name)}
            items={actions}
            disabled={busy}
            onAction={(action) => {

              if (action === 'role') { onChangeRole(member); } else { onRemove(member); }

            }}
          />
        )}
      </li>
    );

  }

  const rows = members.map(renderMember);
  return <ul className="m-0 grid min-w-0 list-none divide-y divide-secondary p-0">{rows}</ul>;

}
