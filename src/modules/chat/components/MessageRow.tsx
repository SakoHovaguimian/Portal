'use client';
import type { MessageRowProps } from '../models/messageRowProps';
import { useLayoutEffect, useRef } from 'react';
import { motionDuration } from '@/components/ui/lib/motionPreferences';
import { Button, InitialsAvatar, UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import { ChatReactionPicker } from './ChatReactionPicker';
import { MessageAttachments } from './MessageAttachments';

export function MessageRow({ message, reply, own, read, userId, busy, failed, onReply, onEdit, onDelete, onPin, onReact }: MessageRowProps) {

  const reactionElement = useRef<HTMLDivElement>(null);
  const reactionRevision = JSON.stringify(message.reactions);
  const previousReactions = useRef(reactionRevision);
  useLayoutEffect(() => {

    const element = reactionElement.current;
    if (previousReactions.current === reactionRevision) {
      return;
    }
    previousReactions.current = reactionRevision;
    const duration = motionDuration('--motion-duration-fast');
    if (!element || !duration || typeof element.animate !== 'function') {
      return;
    }
    const animation = element.animate([{
      transform: 'scale(0.96)',
      opacity: 0.6,
    }, {
      transform: 'scale(1)',
      opacity: 1,
    }], {
      duration,
      easing: getComputedStyle(element).getPropertyValue('--motion-ease-spring').trim(),
    });
    const cleanup = () => animation.cancel();
    return cleanup;

  }, [reactionRevision]);
  const reactions = message.reactions.map((reaction) => <Button key={reaction.emoji} variant="secondary" className="min-h-8 px-2 py-1 text-xs" aria-pressed={reaction.userIds.includes(userId)} aria-label={copy.reactionLabel(reaction.emoji, reaction.userIds.length)} onClick={() => onReact(reaction.emoji)}>{copy.reactionLabel(reaction.emoji, reaction.userIds.length)}</Button>);
  return (<article id={`message-${message.id}`} aria-busy={busy} className={`group flex gap-3 px-4 py-4 sm:px-6 ${own ? 'flex-row-reverse' : ''}`}>

    <InitialsAvatar name={message.author}/>

    <div className={`min-w-0 max-w-[85%] sm:max-w-[78%] ${own ? 'text-right' : ''}`}>

      <div className={`mb-1.5 flex flex-wrap items-center gap-2 ${own ? 'justify-end' : ''}`}>
        <span className="text-xs font-semibold">{own ? copy.you : message.author}</span>
        <time dateTime={message.createdAt} className="text-[10px] text-tertiary">{new Date(message.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}</time>
        {message.editedAt && <span className="text-[10px] text-tertiary">{copy.edited}</span>}
        {message.pinned && <UiIcon name="pin" className="size-3 text-brand-secondary"/>}
      </div>

      <div className={`rounded-card px-4 py-3 text-left ${own ? 'bg-brand-primary text-primary' : 'border-control border-secondary bg-primary text-primary'}`}>

        {reply && <a href={`#message-${reply.id}`} className="mb-3 block border-l-2 border-brand pl-3 text-xs text-tertiary underline-offset-4 hover:underline">
          <span className="block font-semibold text-secondary">{reply.author}</span>
          <span className="line-clamp-2">{reply.deletedAt ? copy.deleted : reply.body}</span>
        </a>}

        <p className={`m-0 whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed ${message.deletedAt ? 'italic text-tertiary' : ''}`}>{message.deletedAt ? copy.deleted : message.body}</p>

        <MessageAttachments attachments={message.attachments}/>

      </div>

      {!message.deletedAt && <><div ref={reactionElement} className={`mt-1.5 flex flex-wrap items-center gap-1 ${own ? 'justify-end' : ''}`}>
        {reactions}
        <Button variant="ghost" className="min-h-8 px-2 py-1 text-[11px]" onClick={onReply}>{copy.reply}</Button>
        <Button variant="ghost" className="min-h-8 px-2 py-1 text-[11px]" onClick={onPin}>{message.pinned ? copy.unpin : copy.pin}</Button>
        {own && <><Button variant="ghost" className="min-h-8 px-2 py-1 text-[11px]" disabled={busy} onClick={onEdit}>{copy.edit}</Button><Button variant="ghost" className="min-h-8 px-2 py-1 text-[11px]" disabled={busy} onClick={onDelete}>{copy.delete}</Button></>}
      </div><div className={`flex items-center gap-1 ${own ? 'justify-end' : ''}`}><ChatReactionPicker disabled={false} onReact={onReact}/>{own && <span className="ml-1 self-center text-[10px] text-tertiary">{read ? copy.read : copy.sent}</span>}</div></>}

      {failed && <p role="alert" className="mt-2 text-xs text-error-primary">{copy.actionFailedHint}</p>}
    </div>

  </article>);

}
