'use client';

import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';

import { cn } from '../lib/cn';
import type { AvatarGroupProps } from '../models/avatarGroupProps';
import { componentExpansionStrings as copy } from '@/strings';

import { Avatar } from './Avatar';

export function AvatarGroup({
  label,
  items,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {

  const limit = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 4;
  const visible = items.slice(0, limit);
  const hidden = items.slice(limit);

  function renderOverflow() {

    if (!(hidden.length > 0)) {
      return null;
    }

    function renderHiddenAvatar({ id, ...item }: (typeof hidden)[number]) {

      return (
        <li key={id} className="flex items-center gap-3">
          <Avatar {...item} size="sm" />
          <span className="text-sm wrap-anywhere text-secondary">
            {item.name}
          </span>
        </li>
      );

    }

    const hiddenAvatars = hidden.map(renderHiddenAvatar);

    return (
      <DialogTrigger>
        <Button
          aria-label={copy.avatar.showMore(hidden.length)}
          className="-ms-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-avatar outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-avatar bg-secondary text-xs font-semibold text-secondary ring-2 ring-primary',
              size === 'sm'
                ? 'size-8'
                : size === 'lg'
                  ? 'size-16'
                  : 'size-11',
            )}
          >
            {copy.avatar.overflow(hidden.length)}
          </span>
        </Button>
        <Popover
          offset={8}
          className="ui-popover z-100 max-w-[calc(100vw-1.5rem)] rounded-overlay border-control border-secondary bg-primary p-4 shadow-(--shadow-overlay)"
        >
          <Dialog
            aria-label={label}
            className="max-h-[min(20rem,60dvh)] overflow-y-auto outline-none"
          >
            <ul className="m-0 grid list-none gap-3 p-0">
              {hiddenAvatars}
            </ul>
          </Dialog>
        </Popover>
      </DialogTrigger>
    );

  }

  function renderVisibleAvatar({ id, ...item }: (typeof visible)[number], index: number) {

    return (
      <Avatar
        key={id}
        {...item}
        size={size}
        className={cn('ring-2 ring-primary', index > 0 && '-ms-2')}
      />
    );

  }

  const visibleAvatars = visible.map(renderVisibleAvatar);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex flex-wrap items-center gap-y-2', className)}
    >
      {visibleAvatars}
      {renderOverflow()}
    </div>
  );

}
