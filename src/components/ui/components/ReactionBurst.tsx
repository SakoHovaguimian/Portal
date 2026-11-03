'use client';

import type { ReactionBurstProps } from '../models/reactionBurstProps';
import { useLayoutEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { motionDuration } from '../lib/motionPreferences';

const particles = Array.from({ length: 14 }, (_, index) => index);

export type { ReactionBurstFrames } from '../models/reactionBurstFrames';

/** Wraps a toggle icon and celebrates with a ring and accent particles when it turns on. */
export function ReactionBurst({
  active,
  ready = true,
  frames,
  children,
}: ReactionBurstProps) {

  const burstRef = useRef<HTMLSpanElement>(null);
  const previousActive = useRef<boolean | undefined>(
    ready ? active : undefined,
  );

  useLayoutEffect(() => {

    if (!ready) { return; }
    const previous = previousActive.current;
    previousActive.current = active;
    if (previous === undefined || previous === active) { return; }
    const burst = burstRef.current;
    const duration = motionDuration('--motion-duration-celebration');
    if (!duration || !burst || typeof burst.animate !== 'function') { return; }
    const easing = getComputedStyle(burst)
      .getPropertyValue('--motion-ease-out')
      .trim();
    const animations: Animation[] = [];
    const icon = burst.querySelector('svg');
    if (icon) {

      animations.push(
        icon.animate(active ? frames.on : frames.off, { duration, easing }),
      );

    }
    if (active) {

      const ring = burst.querySelector('[data-reaction-ring]');
      if (ring) {

        animations.push(
          ring.animate(
            [
              { transform: 'scale(0.4)', opacity: 0.6 },
              { transform: 'scale(1.9)', opacity: 0 },
            ],
            { duration, easing },
          ),
        );

      }
      burst
        .querySelectorAll('[data-reaction-particle]')
        .forEach((particle, index) => {

          const angle = (index / particles.length) * Math.PI * 2;
          const distance = 30 + (index % 3) * 12;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          animations.push(
            particle.animate(
              [
                { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                {
                  transform: `translate(${x * 0.55}px, ${y * 0.55}px) scale(1.15)`,
                  opacity: 1,
                  offset: 0.35,
                },
                {
                  transform: `translate(${x}px, ${y + 10}px) scale(0.3) rotate(${index * 37}deg)`,
                  opacity: 0,
                },
              ],
              { duration, easing, delay: (index % 3) * 18 },
            ),
          );

        });

    }
    const cleanup = () => {
      animations.forEach((animation) => animation.cancel());
    };

    return cleanup;

  }, [active, ready, frames]);

  function renderParticle(particle: (typeof particles)[number]) {

    return (
      <span
        key={particle}
        data-reaction-particle
        className={cn(
          'absolute top-1/2 left-1/2 -mt-0.5 -ml-0.5 opacity-0',
          particle % 2
            ? 'h-1.5 w-1 rounded-control bg-brand-400'
            : 'size-1.5 rounded-full bg-brand-solid',
        )}
      />
    );

  }

  const particleElements = particles.map(renderParticle);

  return (
    <span
      ref={burstRef}
      aria-hidden="true"
      className="pointer-events-none relative inline-flex shrink-0"
    >
      <span className="relative z-1 inline-flex">{children}</span>
      <span
        data-reaction-ring
        className="absolute inset-0 rounded-full border-control border-brand opacity-0"
      />
      {particleElements}
    </span>
  );

}
