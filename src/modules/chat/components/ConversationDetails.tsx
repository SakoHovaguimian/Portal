'use client';

import { useId, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Accordion, Avatar, Badge, Button, Field, Input, Modal, MultiSelect, PageSection, TextArea, UiIcon } from '@/components/ui';
import { cn } from '@/components/ui/lib/cn';
import { useServiceContainer } from '@/providers/AppProviders';
import { portalChatStrings as copy } from '@/strings';

import { DetailsMembers } from './details/DetailsMembers';
import { DetailsPinnedMessages } from './details/DetailsPinnedMessages';
import { DetailsSharedFiles } from './details/DetailsSharedFiles';
import type { ChatMember } from '../models/chatMember';
import type { ConversationDetailsProps } from '../models/conversationDetailsProps';

export function ConversationDetails({ conversation, messages, people, userId, variant = 'sidebar', onChanged, onMessageSelect }: ConversationDetailsProps) {

  const { chatService } = useServiceContainer();
  const queryClient = useQueryClient();
  const sectionId = useId();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(conversation.name);
  const [description, setDescription] = useState(conversation.description);
  const [adding, setAdding] = useState(false);
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [removing, setRemoving] = useState<ChatMember | null>(null);
  const safe = useRef<HTMLButtonElement>(null);
  const current = conversation.members.find((member) => member.id === userId);
  const canManage = Boolean(conversation.kind === 'group' && current && ['owner', 'admin'].includes(current.role));
  const mutation = useMutation({
    mutationFn: (operation: () => Promise<unknown>) => operation(),
    onSuccess: async () => {

      await queryClient.invalidateQueries({ queryKey: ['chat'] });
      setEditing(false);
      setRemoving(null);
      setAdding(false);
      setNewMembers([]);
      onChanged();

    },
  });
  const pins = messages.filter((message) => message.pinned && !message.deletedAt);
  const activeMessages = messages.filter((message) => !message.deletedAt);
  const attachments = Array.from(new Map(activeMessages.flatMap((message) => message.attachments).map((file) => [file.id, file])).values());
  const options = people.filter((person) => {

    const isMember = conversation.members.some((member) => member.id === person.id);
    return !isMember;

  }).map((person) => ({ value: person.id, label: person.name }));

  function changeRole(member: ChatMember) {
    mutation.mutate(() => chatService.changeMember(conversation.id, member.id, 'PATCH', member.role === 'admin' ? 'member' : 'admin'));
  }

  function renderMembers() {

    return (
      <DetailsMembers
        members={conversation.members}
        userId={userId}
        current={current}
        canManage={canManage}
        busy={mutation.isPending}
        onChangeRole={changeRole}
        onRemove={setRemoving}
      />
    );

  }

  function renderAddPeople() {

    if (!canManage) { return null; }
    return (
      <Button
        variant="secondary"
        aria-label={copy.addPeople}
        disabled={mutation.isPending || options.length === 0 || conversation.members.length >= 20}
        onClick={() => setAdding(true)}
      >
        <UiIcon name="plus" className="size-4" />{copy.addPeople}
      </Button>
    );

  }

  function renderSidebarSections() {

    return (
      <Accordion
        className="-mx-5 gap-0"
        itemClassName="rounded-none border-0 border-b-control border-secondary bg-transparent"
        defaultExpandedKeys={[`${sectionId}-members`]}
        items={[
          { id: `${sectionId}-members`, title: copy.membersCount(conversation.members.length), content: <div className="grid gap-3">{renderMembers()}{renderAddPeople()}</div> },
          { id: `${sectionId}-files`, title: copy.filesCount(attachments.length), content: <DetailsSharedFiles attachments={attachments} /> },
          { id: `${sectionId}-pinned`, title: copy.pinsCount(pins.length), content: <DetailsPinnedMessages messages={pins} onMessageSelect={onMessageSelect} /> },
        ]}
      />
    );

  }

  function renderDialogSections() {

    return (
      <div className="grid min-w-0 items-start gap-8 md:grid-cols-2 md:gap-10">
        <PageSection id={`${sectionId}-members`} title={copy.members} description={copy.membersCount(conversation.members.length)}>
          {renderMembers()}
          {renderAddPeople()}
        </PageSection>
        <div className="grid min-w-0 gap-8">
          <PageSection id={`${sectionId}-files`} title={copy.attachments} description={copy.filesCount(attachments.length)}>
            <DetailsSharedFiles attachments={attachments} />
          </PageSection>
          <PageSection id={`${sectionId}-pins`} title={copy.pinned} description={copy.pinsCount(pins.length)} className="border-t-control border-secondary pt-6">
            <DetailsPinnedMessages messages={pins} onMessageSelect={onMessageSelect} />
          </PageSection>
        </div>
      </div>
    );

  }

  function renderOverview() {

    return (
      <section aria-label={copy.overview} className="grid min-w-0 gap-4 border-b-control border-secondary pb-6">
        <p className="m-0 text-xs font-semibold text-tertiary">{copy.overview}</p>
        <div className="flex min-w-0 items-start gap-4">
          <Avatar name={conversation.name} size={variant === 'dialog' ? 'lg' : 'md'} />
          <div className="min-w-0 flex-1">
            <h2 className={cn('m-0 font-display text-lg font-semibold leading-snug tracking-tight text-primary wrap-anywhere', variant === 'dialog' && 'text-2xl')}>{conversation.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge intent="brand">{conversation.kind === 'group' ? copy.group : copy.direct}</Badge>
              {conversation.muted && <Badge>{copy.muted}</Badge>}
              {conversation.archived && <Badge>{copy.archived}</Badge>}
            </div>
          </div>
        </div>
        {conversation.description && <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-secondary wrap-anywhere">{conversation.description}</p>}
      </section>
    );

  }

  function renderActions() {

    return (
      <PageSection id={`${sectionId}-actions`} title={copy.actions} className={cn('gap-3', variant === 'dialog' && 'border-t-control border-secondary pt-6')}>
        <div className={cn('grid min-w-0 gap-2', variant === 'dialog' && 'sm:grid-cols-2 lg:grid-cols-3')}>
          <Button variant="secondary" className="justify-start whitespace-normal text-left" disabled={mutation.isPending} onClick={() => {
            mutation.mutate(() => chatService.updateConversation(conversation.id, { muted: !conversation.muted }));
          }}>
            <UiIcon name="bell" className="size-4 shrink-0" />{conversation.muted ? copy.unmute : copy.mute}
          </Button>
          <Button variant="secondary" className="justify-start whitespace-normal text-left" disabled={mutation.isPending} onClick={() => {
            mutation.mutate(() => chatService.updateConversation(conversation.id, { archived: !conversation.archived }));
          }}>
            <UiIcon name="box" className="size-4 shrink-0" />{conversation.archived ? copy.restore : copy.archive}
          </Button>
          {canManage && <Button variant="ghost" className="justify-start whitespace-normal text-left" disabled={mutation.isPending} onClick={() => {

            setName(conversation.name);
            setDescription(conversation.description);
            setEditing(true);

          }}><UiIcon name="settings" className="size-4 shrink-0" />{copy.editDetails}</Button>}
        </div>
      </PageSection>
    );

  }

  function renderEditDialog() {

    if (!editing) { return null; }
    return (
      <Modal open title={copy.editDetails} onDismiss={() => {

        if (!mutation.isPending) { setEditing(false); }

      }}>
        <form noValidate className="grid gap-4" onSubmit={(event) => {

          event.preventDefault();
          if (!mutation.isPending && name.trim()) { mutation.mutate(() => chatService.updateConversation(conversation.id, { name, description })); }

        }}>
          <Field labelText={copy.name}>
            <Input value={name} maxLength={80} disabled={mutation.isPending} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field labelText={copy.descriptionLabel}>
            <TextArea value={description} maxLength={400} disabled={mutation.isPending} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          {mutation.isError && <p role="alert" className="m-0 text-sm text-error-primary">{copy.failedHint}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" disabled={mutation.isPending} onClick={() => setEditing(false)}>{copy.cancel}</Button>
            <Button type="submit" disabled={mutation.isPending || !name.trim()} loading={mutation.isPending}>{copy.save}</Button>
          </div>
        </form>
      </Modal>
    );

  }

  function renderAddDialog() {

    if (!adding) { return null; }
    return (
      <Modal open title={copy.addPeople} onDismiss={() => {

        if (!mutation.isPending) { setAdding(false); }

      }}>
        <div className="grid gap-5">
          <MultiSelect
            label={copy.people}
            value={newMembers}
            options={options}
            onValueChange={setNewMembers}
            placeholder={copy.peoplePlaceholder}
            selectionLabel={copy.selection}
            clearLabel={copy.clearPeople}
            maxSelections={Math.max(0, 20 - conversation.members.length)}
            disabled={mutation.isPending}
          />
          {mutation.isError && <p role="alert" className="m-0 text-sm text-error-primary">{copy.failedHint}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" disabled={mutation.isPending} onClick={() => setAdding(false)}>{copy.cancel}</Button>
            <Button disabled={!newMembers.length || mutation.isPending} loading={mutation.isPending} onClick={() => {

              mutation.mutate(async () => {

                for (const id of newMembers) { await chatService.changeMember(conversation.id, id, 'POST'); }

              });

            }}>{copy.addPeople}</Button>
          </div>
        </div>
      </Modal>
    );

  }

  function renderRemoveDialog() {

    if (!removing) { return null; }
    return (
      <Modal open title={copy.removeMemberTitle} description={copy.removeMemberHint} initialFocusRef={safe} onDismiss={() => {

        if (!mutation.isPending) { setRemoving(null); }

      }}>
        <p className="text-sm font-semibold text-primary">{removing.name}</p>
        {mutation.isError && <p role="alert" className="text-sm text-error-primary">{copy.failedHint}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button ref={safe} variant="secondary" disabled={mutation.isPending} onClick={() => setRemoving(null)}>{copy.cancel}</Button>
          <Button variant="destructive" disabled={mutation.isPending} loading={mutation.isPending} onClick={() => {
            mutation.mutate(() => chatService.changeMember(conversation.id, removing.id, 'DELETE'));
          }}>{copy.removeMember}</Button>
        </div>
      </Modal>
    );

  }

  return (
    <div className={cn('grid min-w-0 content-start gap-6 p-5', variant === 'dialog' && 'gap-8 p-0 sm:p-1')} aria-busy={mutation.isPending || undefined}>
      {renderOverview()}
      {mutation.isError && <p role="alert" className="m-0 rounded-control bg-error-primary p-3 text-sm text-error-primary">{copy.failedHint}</p>}
      {variant === 'dialog' ? renderDialogSections() : renderSidebarSections()}
      {renderActions()}
      {renderEditDialog()}
      {renderAddDialog()}
      {renderRemoveDialog()}
    </div>
  );

}
