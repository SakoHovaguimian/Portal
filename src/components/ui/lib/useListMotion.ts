'use client';

import { useLayoutEffect, useRef } from 'react';

import type { ListMotionOptions } from '../models/listMotionOptions';

import { animateMotion, motionDuration, readMotionTransform } from './motionPreferences';

// Measure direct, keyed wrappers in the positioned list's layout coordinates.
export function useListMotion<T extends HTMLElement = HTMLOListElement>(
  skipAnimationRef?: { current: boolean },
  durationToken: Parameters<typeof motionDuration>[0] = '--motion-duration-base',
  { animateEnter = true, observeResize = false, presentation = false, anchor = 'top' }: ListMotionOptions = {},
) {

  const listRef = useRef<T>(null);
  const previous = useRef(new Map<string, Pick<DOMRectReadOnly, 'left' | 'top'>>());
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
      const next = new Map<string, Pick<DOMRectReadOnly, 'left' | 'top'>>();
      const disabled = presentation && document.documentElement.dataset.presentationMotion === 'off';
      const duration = skip || disabled ? 0 : motionDuration(durationToken);
      const style = getComputedStyle(list);
      const easing = style.getPropertyValue('--motion-ease-out').trim();
      const originY = anchor === 'bottom' ? list.offsetHeight : 0;
      // Read layout before starting or canceling animations. Offset coordinates
      // exclude scrolling and both the drag preview and FLIP transforms.
      const measured = items.map((item) => {

        const key = item.dataset.motionKey!;
        const position = { left: item.offsetLeft, top: item.offsetTop - originY };
        const old = previous.current.get(key);
        next.set(key, position);
        const deltaX = (old?.left ?? position.left) - position.left;
        const deltaY = (old?.top ?? position.top) - position.top;
        const changed = deltaX !== 0 || deltaY !== 0;
        const animation = activeAnimations.get(item);
        // Retarget from the current visual position during rapid changes.
        const matrix = changed && animation ? readMotionTransform(getComputedStyle(item).transform) : null;
        return {
          item,
          hadPosition: Boolean(old),
          changed,
          animation,
          offsetX: deltaX + (matrix?.m41 ?? 0),
          offsetY: deltaY + (matrix?.m42 ?? 0),
        };

      });
      // Animated children can extend scrollHeight beyond their real resting stack.
      const contentHeight = observeResize
        ? items.reduce((height, item) => height + item.offsetHeight, 0) +
          Math.max(0, items.length - 1) * (Number.parseFloat(style.rowGap) || 0)
        : 0;
      const overflow = observeResize && contentHeight > list.clientHeight + 1;
      for (const { item, hadPosition, changed, animation, offsetX, offsetY } of measured) {

        if (!duration || item.dataset.motion === 'off') {

          animation?.cancel();
          activeAnimations.delete(item);
          continue;

        }
        if (!changed && hadPosition) { continue; }
        animation?.cancel();
        activeAnimations.delete(item);
        let movement: Animation | null = null;
        if (changed) {

          movement = animateMotion(item,
            [{ transform: `translate(${offsetX}px, ${offsetY}px)` }, { transform: 'translate(0, 0)' }],
            { duration, easing },
          );

        } else if (!hadPosition && previous.current.size && animateEnter) {

          movement = animateMotion(item,
            [{ opacity: 0, transform: 'translateY(0.375rem)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration, easing },
          );

        }
        if (movement) {

          const animation = movement;
          const forget = () => {

            if (activeAnimations.get(item) === animation) { activeAnimations.delete(item); }

          };
          animation.onfinish = forget;
          animation.oncancel = forget;
          activeAnimations.set(item, animation);

        }

      }
      for (const [item, animation] of activeAnimations) {

        if (!list.contains(item)) {

          animation.cancel();
          activeAnimations.delete(item);

        }

      }
      previous.current = next;
      if (observeResize) { list.toggleAttribute('data-overflow', overflow); }

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
