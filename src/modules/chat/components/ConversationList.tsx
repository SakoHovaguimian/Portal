'use client';

import { useRef } from 'react';

import { Button, InitialsAvatar, Input, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';

import type { ChatConversation } from '../models/chatConversation';
import type { ConversationListProps } from '../models/conversationListProps';

export function ConversationList({ conversations, selectedId, search, archived, onSearch, onArchived, onSelect }: ConversationListProps) {

  const searchInput = useRef<HTMLInputElement>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase('en-US');
  const matching = conversations.filter((conversation) => {

    const matchesConversation = conversation.archived === archived && `${conversation.name} ${conversation.members.map((member) => member.name).join(' ')}`.toLocaleLowerCase('en-US').includes(normalizedSearch);
    return matchesConversation;

  });

  function renderFolderButton(label: string, showArchived: boolean) {

    const selected = archived === showArchived;
    return (
      <Button
        variant={selected ? 'primary' : 'secondary'}
        className={selected ? undefined : 'text-brand-secondary ring-brand hover:text-brand-secondary'}
        aria-pressed={selected}
        onClick={() => onArchived(showArchived)}
      >
        {label}
      </Button>
    );

  }

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
  return (<aside aria-labelledby="chat-conversations" className="flex h-full min-h-0 flex-col bg-primary">

    <div className="grid gap-5 px-5 pt-6 pb-4">

      <h2 id="chat-conversations" className="m-0 text-lg font-semibold">{copy.all}</h2>

      <div className="flex items-center gap-1">
        <Input ref={searchInput} aria-label={copy.searchPlaceholder} placeholder={copy.searchPlaceholder} value={search} onChange={(event) => onSearch(event.target.value)}/>
        {search && (
          <Button variant="ghost" aria-label={copy.clear} onClick={() => {

            onSearch('');
            searchInput.current?.focus();

          }}>
            <UiIcon name="close"/>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {renderFolderButton(copy.inbox, false)}
        {renderFolderButton(copy.archived, true)}
      </div>

    </div>

    <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">{rows}</ul>

    {matching.length === 0 && <div className="px-5 py-10">
      <p className="font-semibold">{normalizedSearch ? copy.noResultsTitle : copy.noConversationsTitle}</p>
      <p className="text-sm text-tertiary">{normalizedSearch ? copy.noResultsHint : copy.noConversationsHint}</p>
    </div>}

  </aside>);

}
