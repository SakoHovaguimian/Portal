'use client';

import { useLayoutEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { motionDuration } from '../lib/motionPreferences';
import type { ReactionButtonProps } from '../models/reactionButtonProps';
import { Button } from './Button';
import { ReactionBurst, type ReactionBurstFrames } from './ReactionBurst';
import { UiIcon } from './UiIcon';

const heartFrames: ReactionBurstFrames = {
  on: [
    { transform: 'scale(1) rotate(0deg)' },
    { transform: 'scale(0.7) rotate(-12deg)', offset: 0.15 },
    { transform: 'scale(1.3) rotate(7deg)', offset: 0.42 },
    { transform: 'scale(0.96) rotate(-3deg)', offset: 0.72 },
    { transform: 'scale(1) rotate(0deg)' },
  ],
  off: [
    { transform: 'scale(1)' },
    { transform: 'scale(0.85)', offset: 0.4 },
    { transform: 'scale(1)' },
  ],
};

export function ReactionButton({
  liked,
  label,
  count,
  countLabel,
  locale,
  loading = false,
  disabled,
  className,
  ...props
}: ReactionButtonProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const previousLiked = useRef<boolean | undefined>(
    loading ? undefined : liked,
  );

  useLayoutEffect(() => {
    if (loading) return;
    const previous = previousLiked.current;
    previousLiked.current = liked;
    if (previous === undefined || previous === liked) return;
    const counter = countRef.current;
    const duration = motionDuration('--motion-duration-base');
    if (!duration || !counter || typeof counter.animate !== 'function') return;
    const animation = counter.animate(
      [
        {
          transform: `translateY(${liked ? '35%' : '-35%'})`,
          opacity: 0.25,
        },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      {
        duration,
        easing: getComputedStyle(counter)
          .getPropertyValue('--motion-ease-out')
          .trim(),
      },
    );
    return () => animation.cancel();
  }, [liked, loading]);

  return (
    <Button
      {...props}
      variant={liked ? 'secondary' : 'ghost'}
      className={cn(
        'ui-reaction-button ui-engagement-toggle justify-self-start',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={liked}
    >
      <ReactionBurst active={liked} ready={!loading} frames={heartFrames}>
        <UiIcon name="heart" fill={liked ? 'currentColor' : 'none'} />
      </ReactionBurst>
      {label}
      {count !== undefined && (
        <span
          ref={countRef}
          aria-hidden={countLabel ? true : undefined}
          className="text-xs tabular-nums"
        >
          {count.toLocaleString(locale)}
        </span>
      )}
      {countLabel && <span className="sr-only">{countLabel}</span>}
    </Button>
  );
}
