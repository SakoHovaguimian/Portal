'use client';

import { portalUiStrings } from '@/strings';
import type { BookmarkButtonProps } from '../models/bookmarkButtonProps';
import { Button } from './Button';
import { UiIcon } from './UiIcon';

/** A controlled save toggle. Persistence and authorization belong to its caller. */
export function BookmarkButton({
  saved = false,
  children,
  savedLabel = portalUiStrings.engagement.saved,
  className,
  loading = false,
  ...props
}: BookmarkButtonProps) {
  return (
    <Button
      {...props}
      loading={loading}
      className={className}
      aria-pressed={
        props['aria-pressed'] ?? (props.type === 'submit' ? undefined : saved)
      }
    >
      <UiIcon
        name="bookmark"
        fill={saved ? 'currentColor' : 'none'}
        className="size-4"
      />
      {saved ? savedLabel : (children ?? portalUiStrings.engagement.save)}
    </Button>
  );
}
