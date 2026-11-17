'use client';

import { Button, InitialsAvatar, Input, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';

import type { ChatConversation } from '../models/chatConversation';
import type { ConversationListProps } from '../models/conversationListProps';

export function ConversationList({ conversations, selectedId, search, archived, onSearch, onArchived, onSelect, onCreate }: ConversationListProps) {

  const matching = conversations.filter((conversation) => {

    const matchesConversation = conversation.archived === archived && `${conversation.name} ${conversation.members.map((member) => member.name).join(' ')}`.toLocaleLowerCase('en-US').includes(search.toLocaleLowerCase('en-US'));
    return matchesConversation;

  });

  function renderConversation(conversation: ChatConversation) {

    return (<li key={conversation.id}>

      <Button variant="ghost" onClick={() => onSelect(conversation.id)} aria-current={selectedId === conversation.id ? 'page' : undefined} className={`h-auto w-full justify-start gap-3 rounded-none border-l-2 px-4 py-4 text-left ${selectedId === conversation.id ? 'border-l-brand bg-active' : 'border-l-transparent'}`}>

        <InitialsAvatar name={conversation.name}/>

        <span className="min-w-0 flex-1">

          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-primary">{conversation.name}</span>
            <time dateTime={conversation.updatedAt} className="shrink-0 text-[10px] font-normal text-tertiary">{new Date(conversation.updatedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}</time>
          </span>

          <span className="mt-1 flex items-center gap-2">
            <span className="truncate text-xs font-normal text-tertiary">{conversation.lastMessage?.deletedAt ? copy.deleted : conversation.lastMessage?.body || copy.noMessagesTitle}</span>
            {conversation.unreadCount > 0 && <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-solid text-[10px] text-text-primary_on-brand" aria-label={copy.unread}>{conversation.unreadCount}</span>}
            {conversation.muted && <UiIcon name="bell" className="size-3 shrink-0 text-tertiary"/>}
          </span>

        </span>

      </Button>

    </li>);

  }

  const rows = matching.map(renderConversation);
  return (<aside aria-label={copy.inbox} className="flex h-full min-h-0 flex-col bg-primary">

    <div className="grid gap-5 px-5 pt-6 pb-4">

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium tracking-widest text-tertiary">{copy.inbox}</p>
          <h2 className="m-0 mt-1 text-2xl font-semibold tracking-tight">{copy.title}</h2>
        </div>
        <Button variant="secondary" aria-label={copy.newConversation} title={copy.newConversation} onClick={onCreate}><UiIcon name="plus"/></Button>
      </div>

      <div className="flex items-center gap-1"><Input aria-label={copy.searchPlaceholder} placeholder={copy.searchPlaceholder} value={search} onChange={(event) => onSearch(event.target.value)}/>{search && <Button variant="ghost" aria-label={copy.clear} onClick={() => onSearch('')}><UiIcon name="close"/></Button>}</div>

      <div className="flex gap-2">
        <Button variant={archived ? 'ghost' : 'secondary'} aria-pressed={!archived} onClick={() => onArchived(false)}>{copy.inbox}</Button>
        <Button variant={archived ? 'secondary' : 'ghost'} aria-pressed={archived} onClick={() => onArchived(true)}>{copy.archived}</Button>
      </div>

    </div>

    <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">{rows}</ul>

    {matching.length === 0 && <div className="px-5 py-10">
      <p className="font-semibold">{search ? copy.noResultsTitle : copy.noConversationsTitle}</p>
      <p className="text-sm text-tertiary">{search ? copy.noResultsHint : copy.noConversationsHint}</p>
    </div>}

    <p className="m-0 border-t-control border-secondary px-5 py-4 text-xs text-tertiary">{copy.description}</p>

  </aside>);

}
