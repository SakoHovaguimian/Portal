'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Modal, Page, PageHeader, QueryBoundary, UiIcon } from '@/components/ui';
import { cn } from '@/components/ui/lib/cn';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { useUrlState } from '@/providers/useUrlState';
import { portalChatStrings as copy } from '@/strings';

import styles from './ChatScreen.module.css';
import { ConversationDetails } from './components/ConversationDetails';
import { ConversationList } from './components/ConversationList';
import { ConversationThread } from './components/ConversationThread';
import { CreateConversationDialog } from './components/CreateConversationDialog';
import { useChatWorkspace, useConversationMessages } from './hooks';
import type { ChatConversation } from './models/chatConversation';
import type { ChatDraft } from './models/chatDraft';
import { useChatMessageActions } from './useChatMessageActions';
import { useChatOutbox } from './useChatOutbox';

const emptyConversations: ChatConversation[] = [];

export function ChatScreen() {

  const workspace = useChatWorkspace();
  const outbox = useChatOutbox(workspace.userId);
  const messageActions = useChatMessageActions(workspace.userId);
  const conversations = workspace.conversations.data ?? emptyConversations;
  const allowed = ['', ...conversations.map((conversation) => conversation.id)];
  const [selectedId, setSelectedId] = useUrlState('conversation', '', allowed);
  const [folder, setFolder] = useUrlState('folder', 'inbox', ['inbox', 'archived']);
  const [search, setSearch] = useState('');
  const [createdId, setCreatedId] = useState('');
  const [creating, setCreating] = useState(false);
  const [details, setDetails] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, ChatDraft>>({});
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  const hasUnsentMessages = outbox.items.some((item) => item.status !== 'sent');
  useUnsavedFormGuard(dirtyRef, busyRef);
  const selected = conversations.find((conversation) => conversation.id === selectedId);
  const messages = useConversationMessages(selected?.id ?? null);
  const activeDraft = selected ? drafts[selected.id] ?? { body: '', files: [], replyToId: null, clientId: '' } : null;

  useEffect(() => {
    dirtyRef.current = hasUnsentMessages || Object.values(drafts).some((item) => Boolean(item.body.trim() || item.files.length));
  }, [drafts, hasUnsentMessages]);

  function changeDraft(draft: ChatDraft) {

    if (!selected) { return; }
    const nextDrafts = { ...drafts, [selected.id]: { ...draft, clientId: draft.clientId && draft.body === activeDraft?.body && draft.files === activeDraft?.files && draft.replyToId === activeDraft?.replyToId ? draft.clientId : crypto.randomUUID() } };
    dirtyRef.current = hasUnsentMessages || Object.values(nextDrafts).some((item) => Boolean(item.body.trim() || item.files.length));
    setDrafts(nextDrafts);

  }

  async function select(id: string) {

    if (busyRef.current) { return; }
    // Conversation changes preserve drafts in memory, so the page-exit guard is only needed for navigation away.
    dirtyRef.current = false;
    try {

      await setSelectedId(id);
      setDetails(false);

    } finally { dirtyRef.current = hasUnsentMessages || Object.values(drafts).some((item) => Boolean(item.body.trim() || item.files.length)); }

  }

  useEffect(() => {

    if (createdId && conversations.some((conversation) => conversation.id === createdId)) {

      dirtyRef.current = false;
      void setSelectedId(createdId).finally(() => {

        setCreatedId('');
        dirtyRef.current = hasUnsentMessages || Object.values(drafts).some((item) => Boolean(item.body.trim() || item.files.length));

      });

    }

  }, [conversations, createdId, drafts, hasUnsentMessages, setSelectedId]);

  function renderDetails(variant: 'sidebar' | 'dialog' = 'sidebar') {
    return selected ? <ConversationDetails key={selected.id} variant={variant} onMessageSelect={() => setDetails(false)} conversation={selected} messages={messages.data ?? []} people={workspace.people.data ?? []} userId={workspace.userId} onChanged={() => {}} /> : null;
  }

  function renderConversationList() {

    return (
      <div className={cn('min-h-0 min-w-0 bg-secondary_subtle lg:border-e-control lg:border-secondary', selected && 'hidden lg:block')}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId || null}
          search={search}
          archived={folder === 'archived'}
          onSearch={setSearch}
          onArchived={(value) => { void setFolder(value ? 'archived' : 'inbox'); }}
          onSelect={(id) => { void select(id); }}
        />
      </div>
    );

  }

  function renderConversationPanel() {

    return (
      <div className={`min-h-0 min-w-0 ${selected ? '' : 'hidden lg:block'}`}>
        {selected && activeDraft ? (
          <ConversationThread
            actions={messageActions}
            key={selected.id}
            conversation={selected}
            messages={messages.data ?? []}
            userId={workspace.userId}
            draft={activeDraft}
            onDraft={changeDraft}
            onBack={() => { void select(''); }}
            onDetails={() => setDetails(true)}
            outbox={outbox.items.filter((item) => item.conversationId === selected.id)}
            onSend={(draft) => outbox.send(selected.id, draft)}
            demoMode={workspace.demoMode}
            loading={messages.isPending}
            failed={messages.isError}
            onRetry={() => { void messages.refetch(); }}
          />
        ) : (
          <div className="grid h-full content-center justify-items-start overflow-y-auto bg-primary px-8 py-10 xl:px-16">
            <div className="grid max-w-md gap-3">
              <UiIcon name="mail" className="mb-2 size-7 text-brand-secondary" />
              <h2 className="m-0 font-display text-2xl font-semibold tracking-tight text-balance">{copy.emptyTitle}</h2>
              <p className="m-0 text-sm leading-relaxed text-secondary">{copy.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    );

  }

  function renderDetailsSidebar() {

    if (!selected) { return null; }
    return (
      <aside aria-label={copy.details} className="hidden min-h-0 min-w-0 overflow-y-auto overscroll-y-contain border-s-control border-secondary bg-secondary_subtle 2xl:block">{renderDetails()}</aside>
    );

  }

  function renderHeader() {

    return (
      <PageHeader
        title={copy.title}
        description={copy.description}
        action={(
          <Button
            className={selected ? 'max-sm:size-11 max-sm:min-h-11 max-sm:px-0 max-sm:py-0' : undefined}
            onClick={() => setCreating(true)}
            disabled={workspace.people.isPending || workspace.people.isError}
          >
            <UiIcon name="plus" className="size-4" />
            <span className={selected ? 'max-sm:sr-only' : undefined}>{copy.newConversation}</span>
          </Button>
        )}
      />
    );

  }

  function renderWorkspace() {

    return (
      <QueryBoundary query={workspace.conversations} retainDataOnError>
        {() => (
          <div className={cn(
            'grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-card border-control border-secondary bg-primary lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)]',
            selected && '2xl:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)_minmax(16rem,19rem)]',
          )}>
            {renderConversationList()}
            {renderConversationPanel()}
            {renderDetailsSidebar()}
          </div>
        )}
      </QueryBoundary>
    );

  }

  function renderPeopleError() {

    return (
      workspace.people.isError && <div role="alert" className="flex flex-wrap items-center gap-3"><p className="text-sm text-error-primary">{copy.loadFailedHint}</p><Button variant="secondary" onClick={() => { void workspace.people.refetch(); }}>{copy.retry}</Button></div>
    );

  }

  function renderCreateDialog() {

    return (
      creating && <CreateConversationDialog people={workspace.people.data ?? []} onDismiss={() => setCreating(false)} onCreated={(id) => {

        setCreating(false);
        setCreatedId(id);

      }} />
    );

  }

  function renderDetailsDialog() {

    return (
      details && selected && <Modal open size="wide" title={copy.details} onDismiss={() => setDetails(false)}>{renderDetails('dialog')}</Modal>
    );

  }

  return (
    <Page className={cn('flex h-full min-h-0 flex-1 flex-col gap-3 lg:gap-5 [&>.ui-page-header]:shrink-0 [&>.ui-page-header]:py-0', selected && styles.threadOpen)}>
      {renderHeader()}
      {renderWorkspace()}
      {renderPeopleError()}
      {renderCreateDialog()}
      {renderDetailsDialog()}
    </Page>
  );

}
