'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Field, InitialsAvatar, Input, Modal, TextArea, UiIcon } from '@/components/ui';
import { useListMotion } from '@/components/ui/lib/useListMotion';
import { useServiceContainer } from '@/providers/AppProviders';
import { portalChatStrings as copy } from '@/strings';

import { ChatComposer } from './ChatComposer';
import { MessageRow } from './MessageRow';
import { PendingMessageRow } from './PendingMessageRow';
import type { ChatConversation } from '../models/chatConversation';
import type { ChatTimelineItem } from '../models/chatTimelineItem';
import type { ConversationMessage } from '../models/conversationMessage';
import type { ConversationThreadProps } from '../models/conversationThreadProps';

export function ConversationThread({ conversation, messages: serverMessages, actions, userId, draft, onDraft, outbox, onSend, onBack, onDetails, demoMode, loading, failed, onRetry }: ConversationThreadProps) {

  const { chatService } = useServiceContainer();
  const queryClient = useQueryClient();
  const messages = serverMessages.map((message) => actions.projections[message.id] ?? message);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ConversationMessage | null>(null);
  const [body, setBody] = useState('');
  const [deleting, setDeleting] = useState<ConversationMessage | null>(null);
  const editBusy = Boolean(editing && actions.busyIds.includes(editing.id));
  const deleteBusy = Boolean(deleting && actions.busyIds.includes(deleting.id));
  const safe = useRef<HTMLButtonElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const skipMotion = useRef(true);
  const initialHistoryLoaded = useRef(false);
  useLayoutEffect(() => {

    if (loading || !initialHistoryLoaded.current) {
      skipMotion.current = true;
    }
    if (!loading) {
      initialHistoryLoaded.current = true;
    }

  }, [loading]);
  const motion = useListMotion<HTMLUListElement>(skipMotion, '--motion-duration-celebration');
  const lastId = messages.at(-1)?.id;
  const newestPendingId = outbox.at(-1)?.draft.clientId;
  const lastReadMarker = useRef<string>('');
  useEffect(() => {

    const element = scroll.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }

  }, [conversation.id, lastId, newestPendingId]);
  useEffect(() => {

    if (!lastId || loading || failed) {
      return;
    }
    let cancelled = false;

    function markRead() {

      if (document.visibilityState !== 'visible' || lastReadMarker.current === lastId) {
        return;
      }
      lastReadMarker.current = lastId!;
      void chatService.markRead(conversation.id).then((updated) => {

        if (!cancelled) {

          queryClient.setQueryData<ChatConversation[]>(['chat', userId, 'conversations'], (current) => {

            const updatedConversations = current?.map((item) => item.id === updated.id ? updated : item);
            return updatedConversations;

          });

        }

      }).catch(() => { lastReadMarker.current = ''; });

    }

    markRead();
    document.addEventListener('visibilitychange', markRead);
    const cleanup = () => {

      cancelled = true;
      document.removeEventListener('visibilitychange', markRead);

    };

    return cleanup;

  }, [chatService, conversation.id, failed, lastId, loading, queryClient, userId]);
  const matching = (failed ? [] : messages).filter((message) => {

    const matches = !search || message.body.toLocaleLowerCase('en-US').includes(search.toLocaleLowerCase('en-US')) || message.author.toLocaleLowerCase('en-US').includes(search.toLocaleLowerCase('en-US')) || message.attachments.some((file) => file.name.toLocaleLowerCase('en-US').includes(search.toLocaleLowerCase('en-US')));
    return matches;

  });
  const currentReadAt = conversation.members.find((member) => member.id === userId)?.lastReadAt;
  const firstUnread = messages.find((message) => message.authorId !== userId && (!currentReadAt || message.createdAt > currentReadAt));

  function renderMessage(source: ConversationMessage) {

    const message = actions.projections[source.id] ?? source;

    const read = conversation.members.some((member) => member.id !== userId && member.lastReadAt && member.lastReadAt >= message.createdAt);
    return <div>{firstUnread?.id === message.id && <p className="mx-6 border-b-control border-brand pb-2 text-center text-[10px] font-semibold text-brand-secondary">{copy.unread}</p>}<MessageRow message={message} reply={messages.find((item) => item.id === message.replyToId)} own={message.authorId === userId} read={Boolean(read)} userId={userId} busy={actions.busyIds.includes(message.id)} failed={actions.failedIds.includes(message.id)} onReply={() => onDraft({
      ...draft,
      replyToId: message.id,
    })} onEdit={() => {

      setEditing(message);
      setBody(message.body);

    }} onDelete={() => setDeleting(message)} onPin={() => actions.pin(message, !message.pinned)} onReact={(emoji) => actions.react(message, emoji)}/></div>;

  }

  const timeline: ChatTimelineItem[] = matching.map((message) => {

    const local = outbox.find((item) => item.draft.clientId === message.clientId || item.message?.id === message.id);
    return {
      id: local?.draft.clientId ?? message.clientId ?? message.id,
      createdAt: local?.createdAt ?? message.createdAt,
      message,
      pending: null,
    };

  });
  for (const item of outbox) {

    const authoritative = !failed && messages.some((message) => message.clientId === item.draft.clientId || message.id === item.message?.id);
    if ((failed && item.status === 'sent') || authoritative || (search && !item.draft.body.toLocaleLowerCase('en-US').includes(search.toLocaleLowerCase('en-US')))) {
      continue;
    }
    timeline.push({
      id: item.draft.clientId,
      createdAt: item.createdAt,
      message: item.status === 'sent' ? item.message : null,
      pending: item.status === 'sent' ? null : item,
    });

  }
  timeline.sort((firstItem, secondItem) => firstItem.createdAt.localeCompare(secondItem.createdAt));
  const author = conversation.members.find((member) => member.id === userId)?.name ?? copy.you;

  function renderTimelineItem(item: ChatTimelineItem) {
    return <li key={item.id} data-motion-key={item.id}>{item.message ? renderMessage(item.message) : item.pending ? <PendingMessageRow item={item.pending} author={author} reply={messages.find((message) => message.id === item.pending?.draft.replyToId)} onRetry={() => onSend(item.pending!.draft)}/> : null}</li>;
  }

  const rows = timeline.map(renderTimelineItem);

  function renderHeader() {

    return (
      <header className="flex shrink-0 items-center gap-3 border-b-control border-secondary bg-primary px-4 py-4 sm:px-6">
        <Button variant="ghost" className="px-2 lg:hidden" aria-label={copy.back} onClick={onBack}><UiIcon name="chevronLeft"/></Button>
        <InitialsAvatar name={conversation.name}/>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 truncate text-base font-semibold tracking-tight">{conversation.name}</h2>
          <p className="m-0 mt-1 text-[11px] text-tertiary">{conversation.kind === 'group' ? copy.membersCount(conversation.members.length) : copy.direct}</p>
        </div>
        <Button variant="ghost" aria-label={copy.details} onClick={onDetails}><UiIcon name="info"/></Button>
      </header>
    );

  }

  function renderSearch() {

    return (
      <div className="flex shrink-0 items-center gap-2 border-b-control border-secondary bg-primary px-4 py-2 sm:px-6"><UiIcon name="search" className="size-4 text-tertiary"/><Input className="border-0 bg-transparent shadow-none" aria-label={copy.messageSearchPlaceholder} placeholder={copy.messageSearchPlaceholder} value={search} onChange={(event) => {

        skipMotion.current = true;
        setSearch(event.target.value);

      }}/>{search && <Button variant="ghost" aria-label={copy.clear} onClick={() => {

        skipMotion.current = true;
        setSearch('');

      }}><UiIcon name="close" className="size-4"/></Button>}</div>
    );

  }

  function renderMessageLog() {

    return (
      <div ref={scroll} role="log" aria-label={copy.title} aria-busy={loading} tabIndex={0} className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-5 outline-none focus-visible:ring-2 focus-visible:ring-brand">

        {loading && <p role="status" className="px-6 py-10 text-center text-sm text-tertiary">{copy.loading}</p>}

        {failed && <div role="alert" className="px-6 py-4">
          <p className="text-sm text-error-primary">{copy.loadFailedHint}</p>
          <Button variant="secondary" onClick={onRetry}>{copy.retry}</Button>
        </div>}

        {!loading && !failed && !messages.length && <div className="px-6 py-16 text-center">
          <UiIcon name="mail" className="mx-auto mb-4 size-8 text-tertiary"/>
          <p className="font-semibold">{copy.noMessagesTitle}</p>
          <p className="text-sm text-tertiary">{copy.noMessagesHint}</p>
        </div>}

        {!loading && !failed && messages.length > 0 && matching.length === 0 && <div className="px-6 py-16 text-center">
          <p className="font-semibold">{copy.noResultsTitle}</p>
          <p className="text-sm text-tertiary">{copy.noResultsHint}</p>
        </div>}

        <ul ref={motion} className="m-0 list-none p-0"><li data-motion-key="timeline-start" aria-hidden="true" className="hidden"/>{rows}</ul>

      </div>
    );

  }

  function renderComposer() {

    return (
      !failed && !loading && <ChatComposer draft={draft} reply={messages.find((message) => message.id === draft.replyToId)} onDraft={onDraft} onSend={onSend}/>
    );

  }

  function renderEditDialog() {

    return (
      editing && <Modal open title={copy.editTitle} onDismiss={() => {

        if (!editBusy) {
          setEditing(null);
        }

      }}>
        <form noValidate className="grid gap-4" onSubmit={(event) => {

          event.preventDefault();
          if (!editBusy && body.trim()) {
            void actions.edit(editing, body).then(() => setEditing(null)).catch(() => {});
          }

        }}>
          <Field labelText={copy.composeLabel}><TextArea value={body} maxLength={4000} onChange={(event) => setBody(event.target.value)} disabled={editBusy}/></Field>
          {actions.failedIds.includes(editing.id) && <p role="alert" className="text-sm text-error-primary">{copy.actionFailedHint}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={editBusy} onClick={() => setEditing(null)}>{copy.cancel}</Button>
            <Button type="submit" disabled={editBusy || !body.trim()} loading={editBusy}>{copy.save}</Button>
          </div>
        </form>
      </Modal>
    );

  }

  function renderDeleteDialog() {

    return (
      deleting && <Modal open title={copy.deleteTitle} description={copy.deleteHint} initialFocusRef={safe} onDismiss={() => {

        if (!deleteBusy) {
          setDeleting(null);
        }

      }}>
        <p className="line-clamp-4 whitespace-pre-wrap text-sm text-secondary">{deleting.body}</p>
        {actions.failedIds.includes(deleting.id) && <p role="alert" className="text-sm text-error-primary">{copy.actionFailedHint}</p>}
        <div className="flex justify-end gap-2">
          <Button ref={safe} variant="secondary" disabled={deleteBusy} onClick={() => setDeleting(null)}>{copy.cancel}</Button>
          <Button variant="destructive" disabled={deleteBusy} loading={deleteBusy} onClick={() => {
            void actions.remove(deleting).then(() => setDeleting(null)).catch(() => {});
          }}>{copy.delete}</Button>
        </div>
      </Modal>
    );

  }

  return (<section aria-label={conversation.name} className="flex h-full min-h-0 min-w-0 flex-col bg-secondary_subtle">

    {renderHeader()}

    {renderSearch()}

    {renderMessageLog()}

    {renderComposer()}

    <p className="m-0 shrink-0 bg-primary px-6 pb-3 text-[10px] leading-relaxed text-tertiary">{demoMode ? copy.demoHint : copy.liveHint}</p>

    {renderEditDialog()}

    {renderDeleteDialog()}

  </section>);

}
