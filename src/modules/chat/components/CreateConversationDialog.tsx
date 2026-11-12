'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, Field, Input, Modal, MultiSelect, TextArea } from '@/components/ui';
import { useServiceContainer } from '@/providers/AppProviders';
import { portalChatStrings as copy } from '@/strings';

import { ChatConversationInputSchema } from '../models/chatConversation';
import type { CreateConversationDialogProps } from '../models/createConversationDialogProps';

export function CreateConversationDialog({ people, onDismiss, onCreated }: CreateConversationDialogProps) {

  const { chatService } = useServiceContainer();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<'direct' | 'group'>('direct');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState('');
  const create = useMutation({
    mutationFn: () => chatService.createConversation({
      kind,
      name,
      description,
      memberIds,
    }),
    onSuccess: async (conversation) => {

      await queryClient.invalidateQueries({ queryKey: ['chat'] });
      onCreated(conversation.id);

    },
  });
  const options = people.map((person) => ({
    value: person.id,
    label: person.name,
  }));

  function submit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const result = ChatConversationInputSchema.safeParse({
      kind,
      name,
      description,
      memberIds,
    });
    if (!result.success) {

      setValidation(result.error.issues[0]?.message ?? copy.validation.invalid);
      return;

    }
    setValidation('');
    if (!create.isPending) {
      create.mutate();
    }

  }

  return (<Modal open title={copy.newConversation} onDismiss={() => {

    if (!create.isPending) {
      onDismiss();
    }

  }}>

    <form noValidate onSubmit={submit} className="grid gap-5">

      <div className="flex gap-2" role="group" aria-label={copy.newConversation}>
        <Button variant={kind === 'direct' ? 'secondary' : 'ghost'} aria-pressed={kind === 'direct'} onClick={() => {

          setKind('direct');
          setMemberIds([]);

        }}>{copy.direct}</Button>
        <Button variant={kind === 'group' ? 'secondary' : 'ghost'} aria-pressed={kind === 'group'} onClick={() => setKind('group')}>{copy.group}</Button>
      </div>

      <MultiSelect value={memberIds} options={options} onValueChange={setMemberIds} label={copy.choosePeople} placeholder={copy.peoplePlaceholder} selectionLabel={copy.selection} clearLabel={copy.clearPeople} maxSelections={kind === 'direct' ? 1 : 19} disabled={create.isPending}/>

      {kind === 'group' && <><Field labelText={copy.name}><Input value={name} maxLength={80} placeholder={copy.namePlaceholder} onChange={(event) => setName(event.target.value)} disabled={create.isPending}/></Field><Field labelText={copy.descriptionLabel}><TextArea rows={2} value={description} maxLength={400} placeholder={copy.descriptionPlaceholder} onChange={(event) => setDescription(event.target.value)} disabled={create.isPending}/></Field></>}

      {(validation || create.isError) && <p role="alert" className="text-sm text-error-primary">{validation || copy.failedHint}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDismiss} disabled={create.isPending}>{copy.cancel}</Button>
        <Button type="submit" loading={create.isPending} disabled={create.isPending || memberIds.length === 0}>{copy.create}</Button>
      </div>

    </form>

  </Modal>);

}
