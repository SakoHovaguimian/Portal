'use client';

import { useLayoutEffect, useRef } from 'react';

import { animateMotion, motionDuration } from '../lib/motionPreferences';
import { playReactionParticles } from '../lib/playReactionParticles';
import type { ReactionBurstProps } from '../models/reactionBurstProps';

export type { ReactionBurstFrames } from '../models/reactionBurstFrames';

/** Wraps a toggle icon and celebrates with a ring and accent particles when it turns on. */
export function ReactionBurst({
  active,
  ready = true,
  frames,
  children,
}: ReactionBurstProps) {

  const burstRef = useRef<HTMLSpanElement>(null);
  const particleLayerRef = useRef<HTMLSpanElement>(null);
  const previousActive = useRef<boolean | undefined>(
    ready ? active : undefined,
  );

  useLayoutEffect(() => {

    if (!ready) { return; }
    const previous = previousActive.current;
    previousActive.current = active;
    if (previous === undefined || previous === active) { return; }
    const burst = burstRef.current;
    const layer = particleLayerRef.current;
    if (!burst || !layer || typeof burst.animate !== 'function') { return; }
    const duration = motionDuration('--motion-duration-celebration', burst);
    if (!duration) { return; }
    const easing = getComputedStyle(burst)
      .getPropertyValue('--motion-ease-out')
      .trim();
    const icon = burst.querySelector('svg');
    const iconMotion = icon && animateMotion(icon, active ? frames.on : frames.off, { duration, easing });
    const cancelParticles = active ? playReactionParticles(layer, duration, easing) : undefined;
    const cleanup = () => {

      iconMotion?.cancel();
      cancelParticles?.();

    };

    return cleanup;

  }, [active, ready, frames]);

  return (
    <span
      ref={burstRef}
      aria-hidden="true"
      className="pointer-events-none relative inline-flex shrink-0"
    >
      <span className="relative z-1 inline-flex">{children}</span>
      <span ref={particleLayerRef} className="absolute inset-0" />
    </span>
  );

}
