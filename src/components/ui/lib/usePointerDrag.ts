import { useRef } from 'react';
import type { PointerEvent } from 'react';

interface DragSample {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  velocityX: number;
  velocityY: number;
  time: number;
}

interface PointerDragOptions<Element extends HTMLElement> {
  disabled?: boolean;
  onStart?: (event: PointerEvent<Element>, sample: DragSample) => void;
  onMove?: (event: PointerEvent<Element>, sample: DragSample) => void;
  onEnd?: (event: PointerEvent<Element>, sample: DragSample, canceled: boolean) => void;
}

// Match pointer ownership across movement, release, cancellation and capture loss.
export function usePointerDrag<Element extends HTMLElement>({
  disabled,
  onStart,
  onMove,
  onEnd,
}: PointerDragOptions<Element>) {

  const active = useRef<DragSample | null>(null);

  function finish(event: PointerEvent<Element>, canceled: boolean) {

    const sample = active.current;
    if (sample?.id !== event.pointerId) { return; }
    active.current = null;
    const drifted = event.timeStamp - sample.time > 90;
    onEnd?.(event, {
      ...sample,
      velocityX: drifted ? 0 : sample.velocityX,
      velocityY: drifted ? 0 : sample.velocityY,
    }, canceled || !!disabled);

  }

  const handlers = {
    onPointerDown(event: PointerEvent<Element>) {

      if (disabled || active.current || !event.isPrimary || event.button !== 0) { return; }
      const sample: DragSample = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: event.clientX,
        y: event.clientY,
        dx: 0,
        dy: 0,
        velocityX: 0,
        velocityY: 0,
        time: event.timeStamp,
      };
      active.current = sample;
      event.currentTarget.setPointerCapture(event.pointerId);
      onStart?.(event, sample);

    },
    onPointerMove(event: PointerEvent<Element>) {

      const sample = active.current;
      if (disabled || sample?.id !== event.pointerId) { return; }
      const dt = Math.max(1, event.timeStamp - sample.time);
      const previousWeight = dt > 90 ? 0 : 0.35;
      const next: DragSample = {
        ...sample,
        x: event.clientX,
        y: event.clientY,
        dx: event.clientX - sample.startX,
        dy: event.clientY - sample.startY,
        velocityX: sample.velocityX * previousWeight + (event.clientX - sample.x) / dt * (1 - previousWeight),
        velocityY: sample.velocityY * previousWeight + (event.clientY - sample.y) / dt * (1 - previousWeight),
        time: event.timeStamp,
      };
      active.current = next;
      onMove?.(event, next);

    },
    onPointerUp(event: PointerEvent<Element>) {
      finish(event, false);
    },
    onPointerCancel(event: PointerEvent<Element>) {
      finish(event, true);
    },
    onLostPointerCapture(event: PointerEvent<Element>) {
      finish(event, true);
    },
  };

  return handlers;

}
