'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Field, IconButton, InitialsAvatar, Input, Modal, TextArea, UiIcon } from '@/components/ui';
import { cn } from '@/components/ui/lib/cn';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const searchVisible = searchOpen || Boolean(search);
  const searchRegionId = useId();
  const searchInput = useRef<HTMLInputElement>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase('en-US');
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
    if (!element) { return; }
    const log = element;
    let automaticOffset = log.scrollTop;

    function revealLatestMessage() {

      const body = log.querySelector('li:last-child [data-chat-message-body]');
      const bottom = log.scrollHeight - log.clientHeight;
      const bodyStart = body
        ? body.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 8
        : bottom;
      log.scrollTop = Math.max(0, Math.min(bottom, bodyStart));
      automaticOffset = log.scrollTop;

    }

    revealLatestMessage();
    const observer = new ResizeObserver(() => {

      if (Math.abs(log.scrollTop - automaticOffset) <= 1) {
        revealLatestMessage();
      }

    });
    observer.observe(log);
    const cleanup = () => observer.disconnect();
    return cleanup;

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

    const matches = !normalizedSearch || message.body.toLocaleLowerCase('en-US').includes(normalizedSearch) || message.author.toLocaleLowerCase('en-US').includes(normalizedSearch) || message.attachments.some((file) => file.name.toLocaleLowerCase('en-US').includes(normalizedSearch));
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
    if ((failed && item.status === 'sent') || authoritative || (normalizedSearch && !item.draft.body.toLocaleLowerCase('en-US').includes(normalizedSearch))) {
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

  function toggleSearch() {

    if (searchVisible) {

      skipMotion.current = true;
      setSearch('');
      setSearchOpen(false);
      return;

    }
    setSearchOpen(true);
    window.requestAnimationFrame(() => {
      searchInput.current?.focus({ preventScroll: true });
    });

  }

  function renderHeader() {

    return (
      <header className="flex min-w-0 items-center gap-2 px-3 py-2 max-[23rem]:gap-1 max-[23rem]:px-1.5 sm:gap-3 sm:px-5">
        <Button variant="ghost" className="px-2 lg:hidden" aria-label={copy.back} onClick={onBack}><UiIcon name="chevronLeft"/></Button>
        <span className="max-[25rem]:hidden">
          <InitialsAvatar name={conversation.name} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 line-clamp-2 text-base font-semibold tracking-tight wrap-anywhere sm:truncate">{conversation.name}</h2>
          <p className="m-0 text-xs text-tertiary">{conversation.kind === 'group' ? copy.membersCount(conversation.members.length) : copy.direct}</p>
        </div>
        <IconButton
          label={copy.searchConversationAction}
          variant="ghost"
          className="shrink-0 sm:hidden"
          aria-expanded={searchVisible}
          aria-controls={searchRegionId}
          onClick={toggleSearch}
        >
          <UiIcon name="search" />
        </IconButton>
        <IconButton label={copy.details} variant="ghost" className="shrink-0" onClick={onDetails}><UiIcon name="info"/></IconButton>
      </header>
    );

  }

  function renderSearch() {

    return (
      <div
        id={searchRegionId}
        className={cn('grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-1 px-3 pb-2 sm:px-5 @2xl:py-2', !searchVisible && 'max-sm:hidden')}
      ><Input ref={searchInput} className="max-sm:min-h-11 max-sm:py-2" leadingIcon={<UiIcon name="search" className="size-4" />} aria-label={copy.searchConversationAction} placeholder={copy.messageSearchPlaceholder} value={search} onChange={(event) => {

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

        <ul ref={motion} className="relative m-0 list-none p-0"><li data-motion-key="timeline-start" aria-hidden="true" className="hidden"/>{rows}</ul>

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

  return (<section aria-label={conversation.name} className="@container flex h-full min-h-0 min-w-0 flex-col bg-secondary_subtle">

    <div className="grid shrink-0 items-center border-b-control border-secondary bg-primary @2xl:grid-cols-[minmax(0,1fr)_minmax(13rem,0.7fr)]">
      {renderHeader()}
      {renderSearch()}
    </div>

    {renderMessageLog()}

    {renderComposer()}

    <p className="m-0 shrink-0 bg-primary px-3 pb-2 text-[10px] leading-relaxed text-tertiary sm:px-6 sm:pb-3">{demoMode ? copy.demoHint : copy.liveHint}</p>

    {renderEditDialog()}

    {renderDeleteDialog()}

  </section>);

}
