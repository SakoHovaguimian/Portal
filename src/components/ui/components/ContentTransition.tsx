'use client';
import { useLayoutEffect, useRef } from 'react';

import { motionDuration } from '../lib/motionPreferences';
import type { ContentTransitionProps } from '../models/contentTransitionProps';

export function ContentTransition({
  children,
  revision,
  busy = false,
}: ContentTransitionProps) {

  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {

    const element = ref.current;
    const duration = motionDuration('--motion-duration-base');
    if (!element || !duration || typeof element.animate !== 'function') { return; }
    const animation = element.animate(
      [
        { opacity: 0.5, transform: 'translateY(0.25rem)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration,
        easing: getComputedStyle(element)
          .getPropertyValue('--motion-ease-out')
          .trim(),
      },
    );
    const cleanup = () => animation.cancel();
    return cleanup;

  }, [revision]);
  return (
    <div
      ref={ref}
      className="ui-content-transition grid min-w-0 gap-5"
      aria-busy={busy}
    >
      {children}
    </div>
  );

}
