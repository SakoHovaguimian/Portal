'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

import { cn } from '../lib/cn';
import { motionDuration, prefersReducedMotion } from '../lib/motionPreferences';
import { useInteractionAnimation } from '../lib/useInteractionAnimation';
import { usePointerDrag } from '../lib/usePointerDrag';
import type { ImageCompareProps } from '../models/imageCompareProps';
import { interactiveComponentStrings as strings } from '@/strings';

import { UiIcon } from './UiIcon';
import styles from './ImageCompare.module.css';

const copy = strings.compare;

function clampPosition(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function ImageCompare({
  before,
  after,
  label,
  value,
  defaultValue = 50,
  onValueChange,
  onValueCommit,
  showLabels = true,
  elastic = true,
  flickToEdge = true,
  aspectRatio = 4 / 3,
  step = 5,
  sizes = '(max-width: 600px) 100vw, 600px',
  disabled,
  className,
}: ImageCompareProps) {

  const clipId = useId();
  const helpId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const rawPosition = value ?? internal;
  const position = clampPosition(Number.isFinite(rawPosition) ? rawPosition : 50);
  const [bend, setBend] = useState(0);
  const last = useRef(position);
  const { run, stop } = useInteractionAnimation();
  const curve = elastic && !disabled ? Math.max(position - 100, Math.min(position, bend)) : 0;
  const end = (position - curve) / 100;
  const middle = (position + curve) / 100;
  const divider = `M ${end} 0 Q ${middle} .5 ${end} 1`;

  function update(next: number) {

    const clamped = clampPosition(next);
    last.current = clamped;
    if (value === undefined) { setInternal(clamped); }
    onValueChange?.(clamped);

  }

  function place(next: number, difference: number, target?: number) {

    update(next);
    const duration = root.current ? motionDuration('--motion-duration-enter', root.current) : 0;
    const stretch = elastic ? Math.max(-4, Math.min(4, difference * 0.58)) : 0;
    if (!duration || !stretch && target === undefined) {

      stop();
      setBend(0);
      if (target !== undefined && next !== target) { update(target); }
      return;

    }
    setBend(stretch);
    run((elapsed) => {

      const progress = prefersReducedMotion() ? 1 : Math.min(1, elapsed / duration);
      if (target !== undefined) { update(next + (target - next) * (1 - (1 - progress) ** 3)); }
      setBend(stretch * (1 - progress) ** 2 * Math.cos(progress * Math.PI * 1.4));
      return progress < 1;

    });

  }

  function pointerPosition(clientX: number) {

    const rect = root.current?.getBoundingClientRect();
    return rect?.width ? clampPosition((clientX - rect.left) / rect.width * 100) : position;

  }

  const drag = usePointerDrag<HTMLDivElement>({
    disabled,
    onStart(event, { x }) {

      stop();
      event.currentTarget.focus({ preventScroll: true });
      const next = pointerPosition(x);
      place(next, next - position);

    },
    onMove(_, { x }) {

      const next = pointerPosition(x);
      place(next, next - last.current);

    },
    onEnd(_, { dx, velocityX }, canceled) {

      if (canceled) { return; }
      const flick = flickToEdge && Math.abs(dx) > 20 && Math.abs(velocityX) > 0.65;
      if (flick) {

        const target = velocityX < 0 ? 0 : 100;
        place(last.current, velocityX * 7, target);
        onValueCommit?.(target);

      } else {
        onValueCommit?.(last.current);
      }

    },
  });

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {

    if (disabled) { return; }
    const increment = Number.isFinite(step) && step > 0 ? step : 5;
    const targets: Record<string, number> = {
      ArrowLeft: position - increment,
      ArrowDown: position - increment,
      ArrowRight: position + increment,
      ArrowUp: position + increment,
      PageDown: position - increment * 4,
      PageUp: position + increment * 4,
      Home: 0,
      End: 100,
    };
    const target = targets[event.key];
    if (typeof target !== 'number') { return; }
    event.preventDefault();
    const next = clampPosition(target);
    place(next, next - position);
    onValueCommit?.(next);

  }

  return (
    <div className={cn('min-w-0', className)}>
      <span id={helpId} className="sr-only">{copy.descriptionOfImages(before.alt, after.alt)}</span>
      <div
        {...drag}
        ref={root}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-describedby={helpId}
        aria-disabled={disabled || undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={copy.position(Math.round(position))}
        className={cn(styles.compare, 'rounded-card bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-brand')}
        style={{ aspectRatio, '--compare-position': `${position}%` } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        <Image fill unoptimized draggable={false} sizes={sizes} src={after.src} alt={after.alt} aria-hidden="true" className={cn('object-cover', after.className)} />
        <div className={styles.before} style={{ clipPath: `url("#${clipId}")` }}>
          <Image fill unoptimized draggable={false} sizes={sizes} src={before.src} alt={before.alt} aria-hidden="true" className={cn('object-cover', before.className)} />
        </div>
        <svg className={styles.divider} viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={`${divider} L 0 1 V 0 Z`} />
            </clipPath>
          </defs>
          <path d={divider} vectorEffect="non-scaling-stroke" />
        </svg>
        {showLabels && (
          <div className={styles.labels} aria-hidden="true">
            <span className="rounded-control bg-primary px-2.5 py-1 text-xs font-medium text-primary" style={{ opacity: Math.min(1, Math.max(0, (position - 13) / 13)) }}>{before.label ?? copy.before}</span>
            <span className="rounded-control bg-primary px-2.5 py-1 text-xs font-medium text-primary" style={{ opacity: Math.min(1, Math.max(0, (87 - position) / 13)) }}>{after.label ?? copy.after}</span>
          </div>
        )}
        <span className={cn(styles.handle, 'rounded-control border-control border-control-border bg-primary text-primary shadow-(--shadow-slider-thumb)')} aria-hidden="true">
          <UiIcon name="chevronLeft" className="size-3.5" />
          <UiIcon name="chevronRight" className="size-3.5" />
        </span>
      </div>
    </div>
  );

}
