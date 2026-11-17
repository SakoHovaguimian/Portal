import { useCallback, useEffect, useRef } from 'react';

export function useInteractionAnimation() {

  const frame = useRef(0);
  const stop = useCallback(() => {

    cancelAnimationFrame(frame.current);
    frame.current = 0;

  }, []);

  useEffect(() => stop, [stop]);

  const run = useCallback((tick: (elapsed: number) => boolean) => {

    stop();
    const start = performance.now();

    function step(now: number) {

      frame.current = 0;
      if (tick(now - start)) { frame.current = requestAnimationFrame(step); }

    }

    frame.current = requestAnimationFrame(step);

  }, [stop]);

  return { run, stop };

}
