'use client';

import { cn } from '../lib/cn';
import type { BookmarkButtonProps } from '../models/bookmarkButtonProps';
import { portalUiStrings } from '@/strings';

import { Button } from './Button';
import { ReactionBurst, type ReactionBurstFrames } from './ReactionBurst';
import { UiIcon } from './UiIcon';

const bookmarkFrames: ReactionBurstFrames = {
  on: [
    { transform: 'translateY(0) scale(1)' },
    { transform: 'translateY(2px) scale(0.75, 0.85)', offset: 0.15 },
    { transform: 'translateY(-4px) scale(1.25)', offset: 0.45 },
    { transform: 'translateY(0) scale(0.95)', offset: 0.75 },
    { transform: 'translateY(0) scale(1)' },
  ],
  off: [
    { transform: 'scale(1)' },
    { transform: 'scale(0.85)', offset: 0.4 },
    { transform: 'scale(1)' },
  ],
};

/** A controlled save toggle. Persistence and authorization belong to its caller. */
export function BookmarkButton({
  saved = false,
  children,
  savedLabel = portalUiStrings.engagement.saved,
  className,
  loading = false,
  ...props
}: BookmarkButtonProps) {

  const pressed =
    props['aria-pressed'] ?? (props.type === 'submit' ? undefined : saved);
  // Form submissions keep their action styling; only the save toggle celebrates.
  const toggle = pressed !== undefined;
  const icon = (
    <UiIcon
      name="bookmark"
      fill={saved ? 'currentColor' : 'none'}
      className="size-4"
    />
  );
  return (
    <Button
      {...props}
      loading={loading}
      className={cn(toggle && 'ui-engagement-toggle', className)}
      aria-pressed={pressed}
    >
      {toggle ? (
        <ReactionBurst active={saved} ready={!loading} frames={bookmarkFrames}>
          {icon}
        </ReactionBurst>
      ) : (
        icon
      )}
      {saved ? savedLabel : (children ?? portalUiStrings.engagement.save)}
    </Button>
  );

}
