'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { prefersReducedMotion } from '../lib/motionPreferences';
import { useMediaDeck, wrapIndex } from '../lib/useMediaDeck';
import { usePointerDrag } from '../lib/usePointerDrag';
import type { CardSwapProps } from '../models/cardSwapProps';
import type { MediaCardItem } from '../models/mediaCardItem';
import { interactiveComponentStrings as copy } from '@/strings';

import { Button } from './Button';
import styles from './CardSwap.module.css';

export function CardSwap({
  autoAdvance = false,
  intervalMs = 4500,
  visibleCards = 4,
  offset = 1,
  rotation = 5,
  ...props
}: CardSwapProps) {

  const { items, label, disabled, className, cardClassName } = props;
  const { currentIndex, select } = useMediaDeck(props);
  const hover = useRef(false);
  const focused = useRef(false);
  const dragging = useRef(false);
  const ignoreClick = useRef(false);
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  const count = Math.min(items.length, Math.max(1, Math.floor(visibleCards) || 4));
  const front = items[currentIndex];
  const next = () => select(currentIndex + 1);
  const advance = useEffectEvent(() => {

    if (!hover.current && !focused.current && !dragging.current && !document.hidden && !prefersReducedMotion()) {
      next();
    }

  });

  useEffect(() => {

    if (!autoAdvance || disabled || items.length < 2) { return; }
    const timer = window.setInterval(advance, Math.max(1000, intervalMs));
    const clearTimer = () => window.clearInterval(timer);
    return clearTimer;

  }, [autoAdvance, currentIndex, disabled, intervalMs, items.length]);

  const drag = usePointerDrag<HTMLButtonElement>({
    disabled: disabled || items.length < 2,
    onStart(event) {

      ignoreClick.current = false;
      event.currentTarget.focus({ preventScroll: true });
      dragging.current = true;
      setHeld(true);

    },
    onMove(_, { dx, dy }) {

      if (Math.hypot(dx, dy) > 6) { ignoreClick.current = true; }
      setPull({ x: Math.tanh(dx / 100) * 100, y: Math.tanh(dy / 100) * 100 });

    },
    onEnd(_, { dx, dy, velocityX, velocityY }, canceled) {

      dragging.current = false;
      setHeld(false);
      setPull({ x: 0, y: 0 });
      if (canceled) { ignoreClick.current = true; }
      const distance = Math.hypot(dx, dy);
      const flick = distance > 24 && Math.hypot(velocityX, velocityY) > 0.55;
      if (!canceled && (distance > 65 || flick)) { next(); }

    },
  });

  function renderCard(item: MediaCardItem, index: number) {

    const slot = wrapIndex(index - currentIndex, items.length);
    const isFront = slot === 0;
    const position = Math.min(slot, count);
    const shift = Math.min(3, Math.max(0, offset)) * position;

    return (
      <div
        key={item.id}
        inert
        aria-hidden="true"
        data-held={isFront && held || undefined}
        className={cn(styles.card, 'rounded-card bg-primary shadow-(--shadow-card)', cardClassName)}
        style={{
          '--swap-x': `calc(${shift * 9}% + ${isFront ? pull.x : 0}px)`,
          '--swap-y': `calc(${-shift * 7}% + ${isFront ? pull.y : 0}px)`,
          '--swap-scale': Math.max(0.55, 1 - position * 0.075),
          '--swap-rotation': `${rotation + (isFront ? pull.x * 0.045 : slot * 0.35)}deg`,
          zIndex: count - position,
          opacity: slot < count ? 1 : 0,
        } as CSSProperties}
      >
        {item.content}
      </div>
    );

  }

  if (!front) { return null; }
  const cards = items.map(renderCard);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(styles.stack, className)}
      onPointerEnter={() => { hover.current = true; }}
      onPointerLeave={() => { hover.current = false; }}
      onFocus={() => { focused.current = true; }}
      onBlur={() => { focused.current = false; }}
    >
      {cards}
      {items.length > 1 && !disabled && (
        <Button
          {...drag}
          variant="ghost"
          className={cn(styles.trigger, 'rounded-card')}
          style={{ rotate: `${rotation}deg` }}
          aria-label={copy.cardSwap.advanceLabel(front.label)}
          onContextMenu={(event) => event.preventDefault()}
          onClick={(event) => {

            if (event.detail === 0 || !ignoreClick.current) { next(); }

          }}
        />
      )}
      <span className="sr-only" aria-live={autoAdvance ? 'off' : 'polite'}>
        {front.label}
      </span>
    </div>
  );

}
