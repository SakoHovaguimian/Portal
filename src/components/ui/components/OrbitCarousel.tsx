'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';

import { cn } from '../lib/cn';
import { motionDuration, prefersReducedMotion } from '../lib/motionPreferences';
import { useInteractionAnimation } from '../lib/useInteractionAnimation';
import { useMediaDeck, wrapIndex } from '../lib/useMediaDeck';
import { usePointerDrag } from '../lib/usePointerDrag';
import type { MediaCardItem } from '../models/mediaCardItem';
import type { OrbitCarouselProps } from '../models/orbitCarouselProps';
import { interactiveComponentStrings as strings } from '@/strings';

import { IconButton } from './IconButton';
import { UiIcon } from './UiIcon';
import styles from './OrbitCarousel.module.css';

const copy = strings.orbit;
const dragDistance = 135;

function cardPosition(index: number, turn: number, count: number, spread: number, depth: number) {

  const angle = (index - turn) * Math.PI * 2 / count;
  const front = (Math.cos(angle) + 1) / 2;
  return {
    '--orbit-x': `${Math.sin(angle) * spread * 24}cqi`,
    '--orbit-y': `${-(1 - front) * 29}%`,
    '--orbit-scale': 1 - (1 - front) * depth / 200,
    '--orbit-rotate': `${Math.sin(angle) * 7}deg`,
    zIndex: Math.round(front * 100),
  };

}

export function OrbitCarousel({
  spread = 1,
  depth = 100,
  float = 15,
  sink = 50,
  settle = 50,
  showControls = true,
  previousLabel = copy.previous,
  nextLabel = copy.next,
  ...props
}: OrbitCarouselProps) {

  const { items, label, disabled, className, cardClassName } = props;
  const { currentIndex, select } = useMediaDeck(props);
  const track = useRef<HTMLDivElement>(null);
  const slots = useRef(new Map<string, HTMLDivElement>());
  const turn = useRef(currentIndex);
  const startTurn = useRef(currentIndex);
  const inputTarget = useRef<number | null>(null);
  const [held, setHeld] = useState(false);
  const { run, stop } = useInteractionAnimation();
  const count = items.length;
  const radius = Math.min(1.35, Math.max(0, spread));
  const perspective = Math.min(150, Math.max(0, depth));
  const drift = Math.min(100, Math.max(0, float));
  const tilt = Math.min(100, Math.max(0, sink)) * 0.15;

  const paint = useCallback((position: number) => {

    turn.current = position;
    items.forEach((item, index) => {

      const slot = slots.current.get(item.id);
      if (!slot) { return; }
      const { zIndex, ...offsets } = cardPosition(index, position, count, radius, perspective);
      for (const [property, value] of Object.entries(offsets)) {
        slot.style.setProperty(property, String(value));
      }
      slot.style.zIndex = String(zIndex);

    });

  }, [items, count, radius, perspective]);

  const animateTo = useCallback((target: number) => {

    const from = turn.current;
    const base = track.current ? motionDuration('--motion-duration-enter', track.current) : 0;
    const duration = base * (1.8 - Math.min(100, Math.max(0, settle)) / 70);
    if (!duration || Math.abs(from - target) < 0.001) {

      stop();
      paint(target);
      return;

    }

    run((elapsed) => {

      const progress = prefersReducedMotion() ? 1 : Math.min(1, elapsed / duration);
      paint(from + (target - from) * (1 - (1 - progress) ** 4));
      return progress < 1;

    });

  }, [paint, run, settle, stop]);

  function settleAt(index: number) {

    const target = currentIndex + Math.round((turn.current - currentIndex) / count) * count;
    const selectedIndex = wrapIndex(index, count);
    inputTarget.current = selectedIndex === currentIndex ? null : index;
    select(index);
    // Return to the current selection if a controlled caller declines the change.
    animateTo(target);

  }

  useLayoutEffect(() => {

    if (!count) { return; }
    const requested = inputTarget.current;
    inputTarget.current = null;
    const target = requested !== null && wrapIndex(requested, count) === currentIndex
      ? requested
      : currentIndex + Math.round((turn.current - currentIndex) / count) * count;
    paint(turn.current);
    animateTo(target);

  }, [currentIndex, count, paint, animateTo]);

  const drag = usePointerDrag<HTMLDivElement>({
    disabled: disabled || count < 2,
    onStart(event) {

      stop();
      startTurn.current = turn.current;
      event.currentTarget.focus({ preventScroll: true });
      setHeld(true);

    },
    onMove(_, { dx }) {
      paint(startTurn.current - dx / dragDistance);
    },
    onEnd(_, { velocityX }, canceled) {

      setHeld(false);
      const carry = Math.max(-2, Math.min(2, -velocityX * 1.2));
      const target = canceled
        ? currentIndex + Math.round((turn.current - currentIndex) / count) * count
        : Math.round(turn.current + (prefersReducedMotion() ? 0 : carry));
      settleAt(target);

    },
  });

  function navigate(direction: number) {

    const selected = currentIndex + Math.round((turn.current - currentIndex) / count) * count;
    settleAt(selected + direction);

  }

  function updateTilt(event: PointerEvent<HTMLDivElement>) {

    if (!tilt || event.pointerType !== 'mouse' || event.buttons || held) { return; }
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--orbit-tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * tilt}deg`);
    card.style.setProperty('--orbit-tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * tilt}deg`);

  }

  function renderCard(item: MediaCardItem, index: number) {

    return (
      <div
        key={item.id}
        ref={(element) => {

          if (element) { slots.current.set(item.id, element); } else { slots.current.delete(item.id); }

        }}
        className={styles.slot}
        aria-hidden="true"
        style={cardPosition(index, currentIndex, count, radius, perspective) as CSSProperties}
      >
        <div
          className={styles.drift}
          style={{ '--orbit-period': `${5 + (index % 5) * 0.73}s`, '--orbit-float': `${drift * -0.13}px` } as CSSProperties}
          data-float={drift > 0 && !disabled || undefined}
        >
          <div
            className={cn(styles.card, 'rounded-card bg-primary shadow-(--shadow-card)', cardClassName)}
            onPointerMove={disabled ? undefined : updateTilt}
            onPointerLeave={(event) => {

              event.currentTarget.style.removeProperty('--orbit-tilt-x');
              event.currentTarget.style.removeProperty('--orbit-tilt-y');

            }}
          >
            <div className="absolute inset-0" inert>{item.content}</div>
          </div>
        </div>
      </div>
    );

  }

  if (!count) { return null; }
  const cards = items.map(renderCard);
  const canNavigate = count > 1 && !disabled;

  return (
    <div role="group" aria-label={label} className={cn('min-w-0', className)}>
      <div
        {...drag}
        ref={track}
        role="group"
        aria-label={copy.position(items[currentIndex].label, currentIndex + 1, count)}
        tabIndex={canNavigate ? 0 : undefined}
        data-held={held || undefined}
        data-interactive={canNavigate || undefined}
        className={cn(styles.track, 'rounded-card outline-none focus-visible:ring-2 focus-visible:ring-brand')}
        onKeyDown={(event) => {

          if (!canNavigate) { return; }
          const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
          if (!direction) { return; }
          event.preventDefault();
          navigate(direction);

        }}
      >
        {cards}
      </div>
      {showControls && count > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <IconButton label={previousLabel} disabled={disabled} onClick={() => navigate(-1)}>
            <UiIcon name="chevronLeft" />
          </IconButton>
          <output className="min-w-12 text-center text-xs tabular-nums text-tertiary">
            <span aria-hidden="true">{copy.counter(currentIndex + 1, count)}</span>
            <span className="sr-only">{copy.position(items[currentIndex].label, currentIndex + 1, count)}</span>
          </output>
          <IconButton label={nextLabel} disabled={disabled} onClick={() => navigate(1)}>
            <UiIcon name="chevronRight" />
          </IconButton>
        </div>
      )}
    </div>
  );

}
