'use client';
import type { MessageAttachmentsProps } from '../models/messageAttachmentsProps';
import Image from 'next/image';
import { Button, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import type { ChatAttachment } from '../models/chatAttachment';

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {

  function renderFile(file: ChatAttachment) {

    const url = `/api/backend/chat/attachments/${encodeURIComponent(file.id)}`;
    return (<div key={file.id} className="min-w-0 rounded-control border-control border-secondary bg-primary p-2">

      {file.mimeType.startsWith('image/') && <a href={url} target="_blank" rel="noreferrer" aria-label={copy.preview}><Image unoptimized src={url} alt={file.name} width={320} height={200} loading="lazy" className="mb-2 max-h-56 w-full rounded-control object-contain"/></a>}

      {file.mimeType.startsWith('audio/') && <audio controls preload="none" src={`${url}?download=1`} className="mb-2 w-full" aria-label={file.name}/>}

      {file.mimeType.startsWith('video/') && <video controls preload="metadata" src={`${url}?download=1`} className="mb-2 max-h-64 w-full rounded-control" aria-label={file.name}/>}

      <div className="flex min-w-0 items-center gap-2">
        <UiIcon name="file" className="size-4 shrink-0 text-tertiary"/>
        <span className="min-w-0 flex-1 truncate text-xs text-secondary">{file.name}</span>
        <Button asChild variant="ghost" className="min-h-8 px-2 py-1 text-xs">
          <a href={`${url}?download=1`} download={file.name}>{copy.download}</a>
        </Button>
      </div>

    </div>);

  }

  const files = attachments.map(renderFile);
  return <div className="mt-2 grid max-w-sm gap-2">{files}</div>;

}
