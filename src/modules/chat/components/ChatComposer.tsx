'use client';
import type { ChatComposerProps } from '../models/chatComposerProps';
import { useState } from 'react';
import { Button, Field, TextArea, UploadField, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import { CHAT_ATTACHMENT_LIMIT, CHAT_ATTACHMENT_TYPES } from '../models/chatAttachment';

export function ChatComposer({ draft, reply, onDraft, onSend }: ChatComposerProps) {

  const [showFiles, setShowFiles] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  function send() {

    if (!draft.body.trim() && !draft.files.length) {
      return;
    }
    onSend(draft);
    onDraft({
      body: '',
      files: [],
      replyToId: null,
      clientId: crypto.randomUUID(),
    });
    setShowFiles(false);
    setUploadError(false);

  }

  function submit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if ((draft.body.trim() || draft.files.length)) {
      send();
    }

  }

  return (<form noValidate onSubmit={submit} className="shrink-0 border-t-control border-secondary bg-primary p-4 sm:px-6">

    {reply && <div className="mb-3 flex items-start gap-3 border-l-2 border-brand bg-secondary_subtle p-3">
      <div className="min-w-0 flex-1">
        <p className="m-0 text-xs font-semibold text-secondary">{copy.replying} {reply.author}</p>
        <p className="m-0 mt-1 truncate text-xs text-tertiary">{reply.body}</p>
      </div>
      <Button variant="ghost" aria-label={copy.cancel} onClick={() => onDraft({
        ...draft,
        replyToId: null,
      })}><UiIcon name="close"/></Button>
    </div>}

    <Field labelText={copy.composeLabel}><TextArea rows={1} autoGrow className="min-h-11 max-h-40 overflow-y-auto" placeholder={copy.composePlaceholder} maxLength={4000} value={draft.body} onChange={(event) => onDraft({
      ...draft,
      body: event.target.value,
    })} onKeyDown={(event) => {

      if (event.key === 'Enter' && event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey && !event.nativeEvent.isComposing) {

        event.preventDefault();
        if ((draft.body.trim() || draft.files.length)) {
          send();
        }

      }

    }}/></Field>

    {showFiles && <div className="mt-3 max-h-56 min-w-0 overflow-y-auto [&_p]:wrap-anywhere [&_.ui-drop-zone]:min-w-0"><UploadField label={copy.attachments} description={copy.uploadHint} acceptedTypesLabel={copy.attachmentTypes} files={draft.files} accept={CHAT_ATTACHMENT_TYPES.join(',')} maxFiles={4} maxSizeBytes={CHAT_ATTACHMENT_LIMIT} onFiles={(files) => {

      setUploadError(false);
      const additions = files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        file,
        status: 'ready' as const,
      }));
      onDraft({
        ...draft,
        files: [...draft.files, ...additions],
      });

    }} onReject={() => setUploadError(true)} onRemove={(id) => {

      const matchingItems = onDraft({
        ...draft,
        files: draft.files.filter((file) => file.id !== id),
      });

      return matchingItems;

    }}/></div>}

    {uploadError && <p role="alert" className="my-2 text-xs text-error-primary">{copy.validation.attachment}</p>}

    <div className="mt-3 flex items-center justify-between gap-3">
      <Button variant="ghost" aria-expanded={showFiles} onClick={() => setShowFiles(!showFiles)}><UiIcon name="upload" className="size-4"/>{copy.attach}</Button>
      <div className="grid justify-items-end gap-1.5">
        <Button type="submit" disabled={!draft.body.trim() && draft.files.length === 0}>{copy.send}<UiIcon name="arrowRight" className="size-4"/></Button>
        <span className="flex items-center gap-1 text-[10px] text-tertiary" aria-label={copy.sendShortcutLabel}>
          <UiIcon name="shift" className="size-3" aria-hidden="true"/>
          <span aria-hidden="true">{copy.sendShortcutHint}</span>
        </span>
      </div>
    </div>

  </form>);

}
