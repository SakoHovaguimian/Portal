'use client';

import { useLayoutEffect, useRef } from 'react';

import type { ListMotionOptions } from '../models/listMotionOptions';

import { animateMotion, motionDuration, readMotionTransform } from './motionPreferences';

// Keep state immediate; animate real layout deltas on independently keyed wrappers.
export function useListMotion<T extends HTMLElement = HTMLOListElement>(
  skipAnimationRef?: { current: boolean },
  durationToken: Parameters<typeof motionDuration>[0] = '--motion-duration-base',
  { animateEnter = true, observeResize = false, presentation = false }: ListMotionOptions = {},
) {

  const listRef = useRef<T>(null);
  const previous = useRef(new Map<string, DOMRect>());
  const animations = useRef(new Map<HTMLElement, Animation>());
  useLayoutEffect(() => {

    const list = listRef.current;
    if (!list) {

      previous.current.clear();
      return;

    }
    const activeAnimations = animations.current;
    const skip = skipAnimationRef?.current;
    if (skipAnimationRef) { skipAnimationRef.current = false; }
    const measure = () => {

      const items = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-motion-key]'));
      const next = new Map<string, DOMRect>();
      const disabled = presentation && document.documentElement.dataset.presentationMotion === 'off';
      const duration = skip || disabled ? 0 : motionDuration(durationToken);
      const style = getComputedStyle(list);
      const easing = style.getPropertyValue('--motion-ease-out').trim();
      for (const item of items) {

        const key = item.dataset.motionKey!;
        const animation = activeAnimations.get(item);
        const transform = getComputedStyle(item).transform;
        const matrix = animation ? readMotionTransform(transform) : null;
        const visual = item.getBoundingClientRect();
        // Subtract the in-flight translation to measure the new natural layout.
        const rect = new DOMRect(visual.x - (matrix?.m41 ?? 0), visual.y - (matrix?.m42 ?? 0), visual.width, visual.height);
        const old = previous.current.get(key);
        next.set(key, rect);
        const changed = old && (Math.abs(old.top - rect.top) > 0.5 || Math.abs(old.left - rect.left) > 0.5);
        if (!duration || item.dataset.motion === 'off') {

          animation?.cancel();
          activeAnimations.delete(item);
          continue;

        }
        if (!changed && old) { continue; }
        animation?.cancel();
        activeAnimations.delete(item);
        if (changed) {

          const offsetX = old.left + (matrix?.m41 ?? 0) - rect.left;
          const offsetY = old.top + (matrix?.m42 ?? 0) - rect.top;
          const movement = animateMotion(item,
            [{ transform: `translate(${offsetX}px, ${offsetY}px)` }, { transform: 'translate(0, 0)' }],
            { duration, easing },
          );
          if (movement) { activeAnimations.set(item, movement); }

        } else if (!old && previous.current.size && animateEnter) {

          const movement = animateMotion(item,
            [{ opacity: 0, transform: 'translateY(0.375rem)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration, easing },
          );
          if (movement) { activeAnimations.set(item, movement); }

        }

      }
      for (const [item, animation] of activeAnimations) {

        if (!list.contains(item)) {

          animation.cancel();
          activeAnimations.delete(item);

        }

      }
      previous.current = next;
      if (observeResize) {

        // Animated children can extend scrollHeight beyond their real resting stack.
        const contentHeight = items.reduce((height, item) => height + item.offsetHeight, 0) + Math.max(0, items.length - 1) * (Number.parseFloat(style.rowGap) || 0);
        list.toggleAttribute('data-overflow', contentHeight > list.clientHeight + 1);

      }

    };
    measure();
    let resizeFrame = 0;
    const scheduleMeasure = () => {

      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);

    };
    const resize = observeResize && typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleMeasure) : null;
    resize?.observe(list);
    for (const item of list.children) { resize?.observe(item); }
    const device = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = new MutationObserver(measure);
    preference.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion', 'data-presentation-motion'] });
    device.addEventListener('change', measure);
    if (observeResize) { window.addEventListener('resize', scheduleMeasure); }
    const cleanup = () => {

      resize?.disconnect();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', scheduleMeasure);
      preference.disconnect();
      device.removeEventListener('change', measure);

    };

    return cleanup;

  });
  useLayoutEffect(() => {

    const activeAnimations = animations.current;
    const cleanup = () => {

      for (const animation of activeAnimations.values()) { animation.cancel(); }
      activeAnimations.clear();

    };

    return cleanup;

  }, []);
  return listRef;

}
