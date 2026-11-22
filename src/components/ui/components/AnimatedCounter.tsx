'use client';

import { useMemo } from 'react';

import { cn } from '../lib/cn';
import { formatAnimatedCounter } from '../lib/formatAnimatedCounter';
import { useCounterRoll } from '../lib/useCounterRoll';
import { useListMotion } from '../lib/useListMotion';
import type { AnimatedCounterProps } from '../models/animatedCounterProps';

import styles from './AnimatedCounter.module.css';

const faces = '0123456789'.split('');
const faceSizer = faces.map((face) => <span key={face} className={styles.sizer}>{face}</span>);
const wheelFaces = [...faces, ...faces, ...faces].map((face, index) => <span key={index}>{face}</span>);

export function AnimatedCounter({
  value,
  decimals = 0,
  duration,
  padStart = 1,
  separator = ',',
  decimalSeparator = '.',
  grouping = 'western',
  prefix,
  suffix,
  className,
  ...props
}: AnimatedCounterProps) {

  const amount = Number.isFinite(value) ? value : 0;
  const { slots, text } = useMemo(
    () => formatAnimatedCounter(amount, decimals, padStart, grouping, separator, decimalSeparator),
    [amount, decimals, padStart, grouping, separator, decimalSeparator],
  );
  const digitsRef = useListMotion<HTMLSpanElement>(undefined, '--motion-duration-enter', { animateEnter: false });
  useCounterRoll(digitsRef, amount, duration);

  const counterSlots = slots.map(({ key, text, digit }) => (

    <span key={key} data-motion-key={key} className={digit === undefined ? undefined : styles.digit}>
      {digit === undefined ? text : (
        <>
          {faceSizer}
          <span
            data-counter-wheel={digit}
            className={styles.wheel}
            style={{ transform: `translateY(${-(10 + digit) * 100 / wheelFaces.length}%)` }}
          >
            {wheelFaces}
          </span>
        </>
      )}
    </span>

  ));

  return (
    <span {...props} data-slot="animated-counter" className={cn('inline-flex items-baseline tabular-nums whitespace-nowrap', className)}>
      {prefix}
      <span className="sr-only" dir="ltr">{text}</span>
      <span ref={digitsRef} aria-hidden="true" dir="ltr" className="relative inline-flex items-center whitespace-pre select-none">
        {counterSlots}
      </span>
      {suffix}
    </span>
  );

}
