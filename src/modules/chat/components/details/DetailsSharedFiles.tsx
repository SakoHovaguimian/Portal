import Image from 'next/image';
import { Button, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import type { ChatAttachment } from '../../models/chatAttachment';
import type { DetailsSharedFilesProps } from '../../models/detailsSharedFilesProps';

export function DetailsSharedFiles({ attachments }: DetailsSharedFilesProps) {

  const images = attachments.filter((file) => file.mimeType.startsWith('image/'));
  const documents = attachments.filter((file) => !file.mimeType.startsWith('image/'));

  function renderImage(file: ChatAttachment) {

    const url = `/api/backend/chat/attachments/${encodeURIComponent(file.id)}`;
    return (
      <div key={file.id} className="grid min-w-0 content-start gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.imagePreview(file.name)}
          className="relative block aspect-square overflow-hidden rounded-control bg-secondary_subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Image unoptimized src={url} alt={file.name} fill sizes="(max-width: 768px) 40vw, 200px" loading="lazy" className="object-cover" />
        </a>
        <p className="m-0 truncate text-xs font-medium text-secondary" title={file.name}>{file.name}</p>
        <Button asChild variant="ghost" className="w-fit justify-start px-0 text-xs">
          <a href={`${url}?download=1`} download={file.name}><UiIcon name="arrowUp" className="size-3 rotate-180" />{copy.download}</a>
        </Button>
      </div>
    );

  }

  function renderDocument(file: ChatAttachment) {

    const url = `/api/backend/chat/attachments/${encodeURIComponent(file.id)}`;
    return (
      <div key={file.id} className="grid min-w-0 gap-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-secondary_subtle text-secondary"><UiIcon name="file" className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm font-medium text-primary wrap-anywhere">{file.name}</p>
            <p className="m-0 mt-1 text-xs text-tertiary">{copy.fileSize(new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(Math.max(0.1, file.size / 1024)))}</p>
          </div>
        </div>
        {file.mimeType.startsWith('audio/') && <audio controls preload="none" src={`${url}?download=1`} className="w-full min-w-0" aria-label={file.name} />}
        {file.mimeType.startsWith('video/') && <video controls preload="metadata" src={`${url}?download=1`} className="max-h-56 w-full rounded-control" aria-label={file.name} />}
        <Button asChild variant="secondary" className="w-fit text-xs"><a href={`${url}?download=1`} download={file.name}>{copy.download}</a></Button>
      </div>
    );

  }

  const imageRows = images.map(renderImage);
  const documentRows = documents.map(renderDocument);
  if (!attachments.length) { return <p className="m-0 text-sm leading-relaxed text-tertiary">{copy.noFilesHint}</p>; }
  return (
    <div className="grid min-w-0 gap-5">
      {imageRows.length > 0 && (
        <div className="grid gap-3">
          <h4 className="m-0 text-xs font-medium text-tertiary">{copy.images}</h4>
          <div className="grid grid-cols-2 gap-3">{imageRows}</div>
        </div>
      )}
      {documentRows.length > 0 && (
        <div className="grid gap-1">
          <h4 className="m-0 text-xs font-medium text-tertiary">{copy.otherFiles}</h4>
          <div className="divide-y divide-secondary">{documentRows}</div>
        </div>
      )}
    </div>
  );

}
