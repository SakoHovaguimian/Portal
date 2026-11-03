'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Page, PageHeader, QueryBoundary, UiIcon } from '@/components/ui';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { useUrlState } from '@/providers/useUrlState';
import { portalChatStrings as copy } from '@/strings';
import type { ChatConversation } from './models/chatConversation';
import type { ChatDraft } from './models/chatDraft';
import { useChatOutbox } from './useChatOutbox';
import { useChatMessageActions } from './useChatMessageActions';
import { useChatWorkspace, useConversationMessages } from './hooks';
import { ConversationList } from './components/ConversationList';
import { ConversationThread } from './components/ConversationThread';
import { ConversationDetails } from './components/ConversationDetails';
import { CreateConversationDialog } from './components/CreateConversationDialog';

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
    const next = { ...drafts, [selected.id]: { ...draft, clientId: draft.clientId && draft.body === activeDraft?.body && draft.files === activeDraft?.files && draft.replyToId === activeDraft?.replyToId ? draft.clientId : crypto.randomUUID() } };
    dirtyRef.current = hasUnsentMessages || Object.values(next).some((item) => Boolean(item.body.trim() || item.files.length));
    setDrafts(next);

  }

  async function select(id: string) {

    if (busyRef.current) { return; }
    // Conversation changes preserve drafts in memory, so the page-exit guard is only needed for navigation away.
    dirtyRef.current = false;
    try {

      await setSelectedId(id); setDetails(false);

    } finally { dirtyRef.current = hasUnsentMessages || Object.values(drafts).some((item) => Boolean(item.body.trim() || item.files.length)); }

  }

  useEffect(() => {

    if (createdId && conversations.some((conversation) => conversation.id === createdId)) {

      dirtyRef.current = false;
      void setSelectedId(createdId).finally(() => {

        setCreatedId(''); dirtyRef.current = hasUnsentMessages || Object.values(drafts).some((item) => Boolean(item.body.trim() || item.files.length));

      });

    }

  }, [conversations, createdId, drafts, hasUnsentMessages, setSelectedId]);

  function renderDetails(variant: 'sidebar' | 'dialog' = 'sidebar') {
    return selected ? <ConversationDetails key={selected.id} variant={variant} onMessageSelect={() => setDetails(false)} conversation={selected} messages={messages.data ?? []} people={workspace.people.data ?? []} userId={workspace.userId} onChanged={() => {}} /> : null;
  }

  return (
    <Page className="flex h-full min-h-0 flex-1 flex-col gap-5 [&>.ui-page-header]:shrink-0">
      <PageHeader title={copy.title} description={copy.description} action={<Button onClick={() => setCreating(true)} disabled={workspace.people.isPending || workspace.people.isError}><UiIcon name="plus" className="size-4" />{copy.newConversation}</Button>} />
      <QueryBoundary query={workspace.conversations} retainDataOnError>
        {() => (
          <div className="grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-card border-control border-secondary bg-primary shadow-(--shadow-control) lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_320px]">
            <div className={`min-h-0 min-w-0 border-r-control border-secondary ${selected ? 'hidden lg:block' : ''}`}><ConversationList conversations={conversations} selectedId={selectedId || null} search={search} archived={folder === 'archived'} onSearch={setSearch} onArchived={(value) => { void setFolder(value ? 'archived' : 'inbox'); }} onSelect={(id) => { void select(id); }} onCreate={() => setCreating(true)} /></div>
            <div className={`min-h-0 min-w-0 ${selected ? '' : 'hidden lg:block'}`}>
              {selected && activeDraft ? <ConversationThread actions={messageActions} key={selected.id} conversation={selected} messages={messages.data ?? []} userId={workspace.userId} draft={activeDraft} onDraft={changeDraft} onBack={() => { void select(''); }} onDetails={() => setDetails(true)} outbox={outbox.items.filter((item) => item.conversationId === selected.id)} onSend={(draft) => outbox.send(selected.id, draft)} demoMode={workspace.demoMode} loading={messages.isPending} failed={messages.isError} onRetry={() => { void messages.refetch(); }} /> : <div className="flex h-full flex-col items-center justify-center gap-3 bg-secondary_subtle px-8 text-center"><span className="mb-2 flex size-16 items-center justify-center rounded-full border-control border-secondary bg-primary"><UiIcon name="mail" className="size-7 text-brand-secondary" /></span><h2 className="m-0 max-w-xs text-2xl font-semibold tracking-tight">{copy.emptyTitle}</h2><p className="m-0 max-w-xs text-sm leading-relaxed text-tertiary">{copy.emptyHint}</p><Button variant="secondary" className="mt-3" onClick={() => setCreating(true)}>{copy.newConversation}</Button></div>}
            </div>
            <aside aria-label={copy.details} className="hidden min-h-0 min-w-0 overflow-y-auto border-l-control border-secondary bg-primary 2xl:block">{renderDetails()}</aside>
          </div>
        )}
      </QueryBoundary>
      {workspace.people.isError && <div role="alert" className="flex flex-wrap items-center gap-3"><p className="text-sm text-error-primary">{copy.loadFailedHint}</p><Button variant="secondary" onClick={() => { void workspace.people.refetch(); }}>{copy.retry}</Button></div>}
      {creating && <CreateConversationDialog people={workspace.people.data ?? []} onDismiss={() => setCreating(false)} onCreated={(id) => {

        setCreating(false); setCreatedId(id);

      }} />}
      {details && selected && <Modal open size="wide" title={copy.details} onDismiss={() => setDetails(false)}>{renderDetails('dialog')}</Modal>}
    </Page>
  );

}
