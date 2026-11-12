import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react';

import type { SheetDragState } from '../models/sheetDragState';

import { animateMotion, motionDuration, prefersReducedMotion } from './motionPreferences';

export function useSheetDrag(open: boolean, onDismiss: () => void) {

  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<SheetDragState | null>(null);
  const settling = useRef<Animation | null>(null);
  const suppressClick = useRef(false);

  function settle(cancelled: boolean) {

    const panel = panelRef.current;
    const current = drag.current;
    drag.current = null;
    if (!panel || !current) { return; }
    suppressClick.current = current.distance > 4;
    if (!cancelled && (current.distance > Math.min(160, panel.offsetHeight * 0.25) || (current.distance > 24 && current.velocity > 0.6))) {

      onDismiss();
      return;

    }
    const start = getComputedStyle(panel).translate;
    panel.style.removeProperty('--ui-sheet-drag');
    const disabled = panel.dataset.motion === 'off' || document.documentElement.dataset.presentationMotion === 'off';
    const duration = disabled ? 0 : motionDuration(panel.style.getPropertyValue('--ui-overlay-duration') ? '--ui-overlay-duration' : '--ui-overlay-default-duration', panel);
    if (duration) {

      settling.current = animateMotion(panel, [{ translate: start }, { translate: '-50% 0px' }], {
        duration,
        easing: getComputedStyle(panel).getPropertyValue('--ui-overlay-ease').trim() || getComputedStyle(panel).getPropertyValue('--ui-overlay-default-ease').trim(),
      });

    }

  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {

    if (event.button !== 0 || !event.isPrimary) { return; }
    const panel = panelRef.current;
    if (!panel || typeof event.currentTarget.setPointerCapture !== 'function') { return; }
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      return;
    }
    const offset = Number.parseFloat(getComputedStyle(panel).translate.trim().split(/\s+/)[1] ?? '0') || 0;
    settling.current?.cancel();
    panel.style.setProperty('--ui-sheet-drag', `${offset}px`);
    suppressClick.current = false;
    drag.current = { pointerId: event.pointerId, startY: event.clientY - offset, lastY: event.clientY, lastTime: event.timeStamp, distance: 0, velocity: 0 };

  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {

    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) { return; }
    current.distance = Math.max(0, event.clientY - current.startY);
    current.velocity = (event.clientY - current.lastY) / Math.max(1, event.timeStamp - current.lastTime);
    current.lastY = event.clientY;
    current.lastTime = event.timeStamp;
    if (!prefersReducedMotion() && document.documentElement.dataset.presentationMotion !== 'off' && panelRef.current?.dataset.motion !== 'off') {
      panelRef.current?.style.setProperty('--ui-sheet-drag', `${current.distance}px`);
    }

  }

  useEffect(() => {

    if (!open) { drag.current = null; }
    if (open) {

      suppressClick.current = false;
      panelRef.current?.style.removeProperty('--ui-sheet-drag');

    }
    const device = window.matchMedia('(prefers-reduced-motion: reduce)');
    const synchronize = () => {

      if (prefersReducedMotion() || document.documentElement.dataset.presentationMotion === 'off') {

        settling.current?.cancel();
        panelRef.current?.style.removeProperty('--ui-sheet-drag');

      }

    };
    const observer = new MutationObserver(synchronize);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion', 'data-presentation-motion'] });
    device.addEventListener('change', synchronize);
    const cleanup = () => {

      observer.disconnect();
      device.removeEventListener('change', synchronize);
      settling.current?.cancel();
      drag.current = null;

    };

    return cleanup;

  }, [open]);
  const sheetDrag = {
    panelRef,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {

        if (drag.current?.pointerId !== event.pointerId) { return; }
        if (drag.current && event.timeStamp - drag.current.lastTime > 80) { drag.current.velocity = 0; }
        settle(false);

      },
      onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => {

        if (drag.current?.pointerId === event.pointerId) { settle(true); }

      },
      onLostPointerCapture: (event: PointerEvent<HTMLButtonElement>) => {

        if (drag.current?.pointerId === event.pointerId) { settle(true); }

      },
      onClick: (event: MouseEvent<HTMLButtonElement>) => {

        if (event.detail === 0 || !suppressClick.current) { onDismiss(); }
        suppressClick.current = false;

      },
    },
  };

  return sheetDrag;

}
