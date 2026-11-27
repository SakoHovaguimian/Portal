'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

import { cn } from '../lib/cn';
import { motionDuration, prefersReducedMotion } from '../lib/motionPreferences';
import { useInteractionAnimation } from '../lib/useInteractionAnimation';
import { wrapIndex } from '../lib/useMediaDeck';
import { usePointerDrag } from '../lib/usePointerDrag';
import type { TimeScrubberProps } from '../models/timeScrubberProps';

import styles from './TimeScrubber.module.css';

const minutesPerDay = 1440;
const pixelsPerMinute = 2.1;
const digits = '0123456789'.split('');

function dateAt(minutes: number) {
  return new Date(wrapIndex(Math.round(minutes), minutesPerDay) * 60_000);
}

export function TimeScrubber({
  label,
  value,
  defaultValue = 570,
  onValueChange,
  stepMinutes = 15,
  hourCycle = 12,
  locale = 'en-US',
  momentum = 50,
  disabled,
  name,
  className,
}: TimeScrubberProps) {

  const step = Number.isInteger(stepMinutes) && stepMinutes > 0 && stepMinutes <= 60 && minutesPerDay % stepMinutes === 0
    ? stepMinutes
    : 15;
  const [internal, setInternal] = useState(defaultValue);
  const raw = value ?? internal;
  const committed = wrapIndex(Math.round((Number.isFinite(raw) ? raw : 0) / step) * step, minutesPerDay);
  const [motion, setMotion] = useState<{ position: number; from: number; to?: number }>();
  const position = motion && (motion.from === committed || motion.to === committed) ? motion.position : committed;
  const start = useRef(0);
  const ruler = useRef<HTMLDivElement>(null);
  const wheelPosition = useRef<number | null>(null);
  const wheelTimer = useRef(0);
  const { run, stop } = useInteractionAnimation();
  const timeFormat = useMemo(() => new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: hourCycle === 24 ? 'h23' : 'h12',
    timeZone: 'UTC',
  }), [locale, hourCycle]);
  const hourFormat = useMemo(() => new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hourCycle: hourCycle === 24 ? 'h23' : 'h12',
    timeZone: 'UTC',
  }), [locale, hourCycle]);

  function commit(target: number, from: number) {

    const landing = Math.round(target / step) * step;
    const minute = wrapIndex(landing, minutesPerDay);
    if (minute !== committed) {

      if (value === undefined) { setInternal(minute); }
      onValueChange?.(minute);

    }
    const duration = ruler.current ? motionDuration('--motion-duration-enter', ruler.current) : 0;
    if (!duration || Math.abs(from - landing) < 0.01) {

      stop();
      setMotion(undefined);
      return;

    }
    run((elapsed) => {

      const progress = prefersReducedMotion() ? 1 : Math.min(1, elapsed / duration);
      setMotion(progress < 1 ? {
        position: from + (landing - from) * (1 - (1 - progress) ** 4),
        from: committed,
        to: minute,
      } : undefined);
      return progress < 1;

    });

  }

  function clearWheel() {

    window.clearTimeout(wheelTimer.current);
    wheelPosition.current = null;

  }

  const settleWheel = useEffectEvent(() => {

    const last = wheelPosition.current;
    clearWheel();
    if (last !== null) { commit(last, last); }

  });

  const scrollTime = useEffectEvent((event: WheelEvent) => {

    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) { return; }
    event.preventDefault();
    stop();
    const pageWidth = ruler.current?.clientWidth ?? 280;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageWidth : 1;
    const next = (wheelPosition.current ?? position) + event.deltaX * scale / pixelsPerMinute;
    wheelPosition.current = next;
    setMotion({ position: next, from: committed });
    window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(settleWheel, 130);

  });

  useEffect(() => {

    const element = ruler.current;
    if (!element || disabled) { return; }

    function onWheel(event: WheelEvent) {
      scrollTime(event);
    }

    element.addEventListener('wheel', onWheel, { passive: false });
    const removeWheelListener = () => {

      element.removeEventListener('wheel', onWheel);
      clearWheel();

    };

    return removeWheelListener;

  }, [disabled]);

  const drag = usePointerDrag<HTMLDivElement>({
    disabled,
    onStart(event) {

      clearWheel();
      stop();
      start.current = position;
      event.currentTarget.focus({ preventScroll: true });

    },
    onMove(_, { dx }) {
      setMotion({ position: start.current - dx / pixelsPerMinute, from: committed });
    },
    onEnd(_, { dx, velocityX }, canceled) {

      if (canceled) {

        setMotion(undefined);
        return;

      }
      const from = start.current - dx / pixelsPerMinute;
      const intensity = Math.min(100, Math.max(0, momentum));
      const carry = prefersReducedMotion() ? 0 : Math.min(120, Math.max(-120, -velocityX * intensity * 1.8));
      commit(from + carry, from);

    },
  });

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {

    if (disabled) { return; }
    const targets: Record<string, number> = {
      ArrowLeft: committed - step,
      ArrowDown: committed - step,
      ArrowRight: committed + step,
      ArrowUp: committed + step,
      PageDown: committed - step * 4,
      PageUp: committed + step * 4,
      Home: 0,
      End: minutesPerDay - step,
    };
    const target = targets[event.key];
    if (typeof target !== 'number') { return; }
    event.preventDefault();
    clearWheel();
    const from = position + Math.round((target - position) / minutesPerDay) * minutesPerDay;
    commit(target, from);

  }

  function renderTime() {

    const parts = timeFormat.formatToParts(dateAt(position));
    const time = parts.map(({ type, value: part }, index) => {

      if (type === 'dayPeriod') { return <span key={index} className={styles.period}>{part}</span>; }
      // ICU versions differ on the space preceding a day period in formatToParts.
      const separator = type === 'literal' && (part === '\u00a0' || part === '\u202f');
      const characters = Array.from(separator ? ' ' : part).map((character, digitIndex) => {

        const digit = digits.indexOf(character);
        if (digit === -1) { return <span key={digitIndex}>{character}</span>; }

        return (
          <span className={styles.digit} key={digitIndex}>
            <span className={styles.strip} style={{ translate: `0 ${-digit}em` }}>
              {digits.map((number) => <span key={number}>{number}</span>)}
            </span>
          </span>
        );

      });
      return <span key={index} className={styles.part}>{characters}</span>;

    });

    return <div className={styles.time} aria-hidden="true">{time}</div>;

  }

  function renderRuler() {

    const first = Math.floor(position / 5) * 5 - 180;
    const ticks = Array.from({ length: 73 }, (_, index) => {

      const minute = first + index * 5;
      const hour = minute % 60 === 0;
      const quarter = minute % 15 === 0;
      const x = (minute - position) * pixelsPerMinute;
      const weight = Math.max(0, 1 - (Math.abs(x) / 280) ** 1.6);
      return (
        <span
          key={minute}
          className={styles.tick}
          data-hour={hour || undefined}
          data-quarter={quarter || undefined}
          style={{
            '--tick-x': `${x}px`,
            '--tick-scale': (0.55 + weight * 0.45).toFixed(4),
            '--tick-opacity': (0.28 + weight * 0.72).toFixed(4),
          } as CSSProperties}
        >
          {hour && <span className={styles.hour}>{hourFormat.format(dateAt(minute))}</span>}
        </span>
      );

    });

    return (
      <div
        {...drag}
        ref={ruler}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-valuemin={0}
        aria-valuemax={minutesPerDay - step}
        aria-valuenow={committed}
        aria-valuetext={timeFormat.format(dateAt(committed))}
        className={cn(styles.ruler, 'rounded-control outline-none focus-visible:ring-2 focus-visible:ring-brand')}
        onKeyDown={onKeyDown}
      >
        <div className={styles.track} aria-hidden="true">{ticks}</div>
        <span className={styles.marker} aria-hidden="true" />
      </div>
    );

  }

  return (
    <div className={cn(styles.scrubber, 'rounded-card border-control border-secondary bg-primary shadow-(--shadow-control)', className)}>
      {renderTime()}
      {renderRuler()}
      {name && <input type="hidden" name={name} value={committed} disabled={disabled} />}
    </div>
  );

}
