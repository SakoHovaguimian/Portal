import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

import { animateMotion, motionDuration, prefersReducedMotion, readMotionTransform } from './motionPreferences';

const wheelSize = 10;

type CounterWheel = {
  digit: number;
  animation: Animation | null;
};

function wrap(position: number) {
  return ((position % wheelSize) + wheelSize) % wheelSize;
}

export function useCounterRoll(ref: RefObject<HTMLSpanElement | null>, amount: number, duration?: number) {

  const previousAmount = useRef(amount);
  const wheels = useRef(new Map<HTMLElement, CounterWheel>());

  useLayoutEffect(() => {

    const container = ref.current;
    if (!container) { return; }

    const previous = wheels.current;
    const next = new Map<HTMLElement, CounterWheel>();
    const changed = amount !== previousAmount.current;
    const direction = Math.abs(amount) >= Math.abs(previousAmount.current) ? 1 : -1;
    const durationMs = prefersReducedMotion() ? 0 : duration === undefined || !Number.isFinite(duration)
      ? motionDuration('--motion-duration-enter', container)
      : Math.min(60, Math.max(0, duration)) * 1000;
    const easing = getComputedStyle(container).getPropertyValue('--motion-ease-out').trim();

    for (const strip of container.querySelectorAll<HTMLElement>('[data-counter-wheel]')) {

      const digit = Number(strip.dataset.counterWheel);
      const old = previous.get(strip);
      if (old?.digit === digit) {

        if (!durationMs) {

          old.animation?.cancel();
          old.animation = null;

        }
        next.set(strip, old);
        continue;

      }
      const height = Number.parseFloat(getComputedStyle(strip).lineHeight);
      const matrix = old?.animation?.playState === 'running'
        ? readMotionTransform(getComputedStyle(strip).transform)
        : null;
      old?.animation?.cancel();

      let animation: Animation | null = null;
      if (changed && durationMs && height) {

        // Center the current face in the strip so either direction can cross zero.
        const from = wheelSize + wrap(matrix ? -matrix.m42 / height : old?.digit ?? 0);
        const delta = direction * wrap(direction * (digit - from));
        animation = animateMotion(strip, [
          { transform: `translateY(${-from * height}px)` },
          { transform: `translateY(${-(from + delta) * height}px)` },
        ], { duration: durationMs, easing });

      }
      next.set(strip, { digit, animation });

    }

    for (const [strip, { animation }] of previous) {

      if (!next.has(strip)) { animation?.cancel(); }

    }
    wheels.current = next;
    previousAmount.current = amount;

  });

  useLayoutEffect(() => {

    function cancelRolls() {

      for (const wheel of wheels.current.values()) {

        wheel.animation?.cancel();
        wheel.animation = null;

      }

    }

    function updateMotionPreference() {

      if (prefersReducedMotion()) { cancelRolls(); }

    }

    const device = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = new MutationObserver(updateMotionPreference);
    preference.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    device.addEventListener('change', updateMotionPreference);
    const cleanup = () => {

      preference.disconnect();
      device.removeEventListener('change', updateMotionPreference);
      cancelRolls();

    };

    return cleanup;

  }, []);

}
