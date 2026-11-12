import { useEffect, useRef, type CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { useListMotion } from '../lib/useListMotion';
import type { ToastGroupProps } from '../models/toastGroupProps';

import { Button } from './Button';
import { IosPushNotification } from './IosPushNotification';
import { Message } from './Message';

export function ToastGroup({ position, toasts, onDismiss, onExitComplete, onPause, onResume }: ToastGroupProps) {

  const hovered = useRef(new Set<string>());
  useEffect(() => {

    for (const id of hovered.current) {

      if (!toasts.some((toast) => toast.id === id)) { hovered.current.delete(id); }

    }

  }, [toasts]);
  const listRef = useListMotion<HTMLDivElement>(undefined, '--motion-duration-enter', { animateEnter: false, observeResize: true, presentation: true });
  const items = toasts.filter((toast) => toast.position === position);
  if (position.startsWith('top')) { items.reverse(); }

  function renderToast(toast: (typeof items)[number]) {

    return (
      <div key={toast.id} data-motion-key={toast.id} data-motion={toast.motionEnabled === false || toast.motionDurationMs === 0 ? 'off' : undefined} className="ui-toast-slot min-w-0">
        <div
          onPointerEnter={(event) => {

            if (event.pointerType === 'touch') { return; }
            hovered.current.add(toast.id);
            onPause?.(toast.id);

          }}
          onPointerLeave={(event) => {

            if (event.pointerType === 'touch') { return; }
            hovered.current.delete(toast.id);
            if (!event.currentTarget.contains(document.activeElement)) { onResume?.(toast.id); }

          }}
          onFocus={() => onPause?.(toast.id)}
          onBlur={(event) => {

            if (!event.currentTarget.contains(event.relatedTarget) && !hovered.current.has(toast.id)) { onResume?.(toast.id); }

          }}
          onAnimationEnd={(event) => {

            if (event.target === event.currentTarget && event.animationName === 'ui-toast-exit') { onExitComplete?.(toast.id); }

          }}
          data-position={position}
          data-exiting={toast.exiting || undefined}
          data-motion={toast.motionEnabled === false ? 'off' : undefined}
          className={cn(
            'ui-toast pointer-events-auto',
            toast.appearance !== 'ios-push' &&
              'rounded-overlay bg-primary shadow-(--shadow-overlay) [&>.ui-message]:rounded-overlay',
          )}
          style={
            toast.motionEnabled === false
              ? undefined
              : ({
                ...toast.motionStyle,
                '--ui-overlay-duration':
                  toast.motionDurationMs === undefined
                    ? 'var(--presentation-toast-duration, var(--motion-toast-duration))'
                    : `${toast.motionDurationMs}ms`,
              } as CSSProperties)
          }
        >
          {toast.appearance === 'ios-push' ? (
            <IosPushNotification
              title={toast.title}
              body={toast.description}
              onDismiss={() => onDismiss(toast.id)}
            />
          ) : (
            <Message
              title={toast.title}
              description={toast.description}
              intent={toast.intent}
              className={
                !toast.description
                  ? 'items-center py-2 [&>svg]:mt-0'
                  : undefined
              }
              onDismiss={() => onDismiss(toast.id)}
            />
          )}
          {(toast.meta || (toast.actionLabel && toast.onAction)) && (
            <div className="flex flex-wrap items-center gap-2 p-3 pt-0">
              {toast.meta && (
                <span className="text-xs text-secondary">
                  {toast.meta}
                </span>
              )}
              {toast.actionLabel && toast.onAction && (
                <Button
                  variant="ghost"
                  onClick={() => void toast.onAction?.()}
                >
                  {toast.actionLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );

  }

  const toastItems = items.map(renderToast);
  return items.length ? (
    <div ref={listRef} data-position={position} className="ui-toast-group pointer-events-none absolute grid w-[min(92vw,26rem)] gap-3">
      {toastItems}
    </div>
  ) : null;

}
