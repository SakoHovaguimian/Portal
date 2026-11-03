'use client';
import type { PendingMessageRowProps } from '../models/pendingMessageRowProps';
import { Button, FileList, InitialsAvatar } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';

export function PendingMessageRow({ item, author, reply, onRetry }: PendingMessageRowProps) {

  const files = item.draft.files.map((file) => ({
    ...file,
    status: item.status === 'sending' ? 'uploading' as const : 'error' as const,
  }));
  return <article className="flex flex-row-reverse gap-3 px-4 py-4 sm:px-6" aria-busy={item.status === 'sending'}>
    <InitialsAvatar name={author}/>
    <div className="min-w-0 max-w-[85%] text-right sm:max-w-[78%]">
      <p className="m-0 mb-1.5 text-xs font-semibold">{copy.you}</p>
      <div className="rounded-card bg-brand-primary px-4 py-3 text-left text-primary">
        {reply && <div className="mb-3 border-l-2 border-brand pl-3 text-xs text-secondary">
          <span className="font-semibold">{reply.author}</span>
          <p className="m-0 mt-1 line-clamp-2">{reply.body}</p>
        </div>}
        <p className="m-0 whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed">{item.draft.body}</p>
        {item.draft.files.length > 0 && <div className="mt-3 max-w-sm"><FileList files={files}/></div>}
      </div>
      <div role="status" className="mt-2 flex items-center justify-end gap-2 text-[11px] text-tertiary">{item.status === 'failed' ? <><span className="text-error-primary">{copy.sendFailed}</span><Button variant="secondary" className="min-h-8 px-2 py-1 text-xs" onClick={onRetry}>{copy.retrySend}</Button></> : <span>{copy.sending}</span>}</div>
      {item.status === 'failed' && <p role="alert" className="mt-1 max-w-xs text-xs text-error-primary">{copy.sendFailedHint}</p>}
    </div>
  </article>;

}
