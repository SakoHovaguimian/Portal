'use client';

import { useId, useState, type KeyboardEvent } from 'react';

import { Button, Field, TextArea, UploadField, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';

import { CHAT_ATTACHMENT_LIMIT, CHAT_ATTACHMENT_TYPES } from '../models/chatAttachment';
import type { ChatComposerProps } from '../models/chatComposerProps';

export function ChatComposer({ draft, reply, onDraft, onSend }: ChatComposerProps) {

  const shortcutHintId = useId();
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
    send();

  }

  function renderReply() {

    return (
      reply && <div className="mb-3 flex items-start gap-3 border-l-2 border-brand bg-secondary_subtle p-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-semibold text-secondary">{copy.replying} {reply.author}</p>
          <p className="m-0 mt-1 truncate text-xs text-tertiary">{reply.body}</p>
        </div>
        <Button variant="ghost" aria-label={copy.cancel} onClick={() => onDraft({
          ...draft,
          replyToId: null,
        })}><UiIcon name="close"/></Button>
      </div>
    );

  }

  function handleMessageKey(event: KeyboardEvent<HTMLTextAreaElement>) {

    if (
      event.key !== 'Enter' || !event.shiftKey || event.metaKey || event.ctrlKey || event.altKey ||
      event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229
    ) { return; }
    event.preventDefault();
    send();

  }

  function renderMessageField() {

    return (
      <Field labelText={copy.composeLabel}>
        <TextArea
          rows={1}
          autoGrow
          className="min-h-11 max-h-40 overflow-y-auto"
          placeholder={copy.composePlaceholder}
          maxLength={4000}
          value={draft.body}
          aria-describedby={shortcutHintId}
          aria-keyshortcuts="Shift+Enter"
          onChange={(event) => onDraft({ ...draft, body: event.target.value })}
          onKeyDown={handleMessageKey}
        />
      </Field>
    );

  }

  function renderAttachmentPicker() {

    return (
      showFiles && <div className="mt-3 max-h-56 min-w-0 overflow-y-auto [&_p]:wrap-anywhere [&_.ui-drop-zone]:min-w-0"><UploadField label={copy.attachments} description={copy.uploadHint} acceptedTypesLabel={copy.attachmentTypes} files={draft.files} accept={CHAT_ATTACHMENT_TYPES.join(',')} maxFiles={4} maxSizeBytes={CHAT_ATTACHMENT_LIMIT} onFiles={(files) => {

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

        const draftUpdateResult = onDraft({
          ...draft,
          files: draft.files.filter((file) => file.id !== id),
        });

        return draftUpdateResult;

      }}/></div>
    );

  }

  function renderUploadError() {

    return (
      uploadError && <p role="alert" className="my-2 text-xs text-error-primary">{copy.validation.attachment}</p>
    );

  }

  function renderActions() {

    return (
      <div className="mt-2 flex flex-wrap items-start justify-between gap-1.5">
        <Button variant="ghost" className="max-sm:min-h-11 max-sm:px-2 max-sm:py-1.5 max-[23rem]:min-w-11" aria-expanded={showFiles} title={copy.attach} onClick={() => setShowFiles(!showFiles)}>
          <UiIcon name="upload" className="size-4" />
          <span className="max-[23rem]:sr-only">{copy.attach}</span>
        </Button>
        <div className="grid justify-items-end gap-1.5">
          <Button type="submit" className="max-sm:min-h-11 max-sm:px-2.5 max-sm:py-1.5" disabled={!draft.body.trim() && draft.files.length === 0}>{copy.send}<UiIcon name="arrowRight" className="hidden size-4 sm:block"/></Button>
          <span className="flex items-center gap-1 text-[10px] text-tertiary max-sm:sr-only" id={shortcutHintId}>
            <span className="sr-only">{copy.sendShortcutLabel}</span>
            <UiIcon name="shift" className="size-3" aria-hidden="true"/>
            <span aria-hidden="true">{copy.sendShortcutHint}</span>
          </span>
        </div>
      </div>
    );

  }

  return (<form noValidate onSubmit={submit} className="shrink-0 border-t-control border-secondary bg-primary p-3 sm:px-6 sm:py-4">

    {renderReply()}

    {renderMessageField()}

    {renderAttachmentPicker()}

    {renderUploadError()}

    {renderActions()}

  </form>);

}
