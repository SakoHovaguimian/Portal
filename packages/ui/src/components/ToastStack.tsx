import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type ToastIntent = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  intent: ToastIntent;
  position: ToastPosition;
  motionEnabled?: boolean;
  motionDurationMs?: number;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  meta?: ReactNode;
};

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

const intentClasses: Record<ToastIntent, string> = {
  info: 'bg-primary',
  success: 'bg-primary',
  warning: 'bg-primary',
  danger: 'bg-primary',
};

const intentAccentClasses: Record<ToastIntent, { bar: string; iconBg: string; iconFg: string }> = {
  info: {
    bar: 'bg-brand-solid',
    iconBg: 'bg-brand-primary/35',
    iconFg: 'text-brand-secondary',
  },
  success: {
    bar: 'bg-success-primary',
    iconBg: 'bg-success-secondary/35',
    iconFg: 'text-success-primary',
  },
  warning: {
    bar: 'bg-warning-primary',
    iconBg: 'bg-warning-secondary/35',
    iconFg: 'text-warning-primary',
  },
  danger: {
    bar: 'bg-error-primary',
    iconBg: 'bg-error-secondary/35',
    iconFg: 'text-error-primary',
  },
};

function ToastIntentIcon({ intent }: { intent: ToastIntent }) {
  if (intent === 'success') {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M4.5 10.5 8 14l7.5-7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (intent === 'danger') {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (intent === 'warning') {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M10 5.5v5.5m0 3h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M10 8v5m0-8.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function getEntryAnimationClass(position: ToastPosition) {
  return position.startsWith('top') ? 'slide-in-from-top-3' : 'slide-in-from-bottom-3';
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const grouped = toasts.reduce<Record<ToastPosition, ToastItem[]>>(
    (accumulator, toast) => {
      accumulator[toast.position].push(toast);
      return accumulator;
    },
    {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    },
  );

  return (
    <>
      {Object.entries(grouped).map(([position, items]) =>
        items.length > 0 ? (
          <div
            key={position}
            className={cn(
              'pointer-events-none fixed z-[70] flex w-[min(92vw,24rem)] flex-col gap-3',
              positionClasses[position as ToastPosition],
            )}
          >
            {items.map((toast) => (
              <div
                key={toast.id}
                className={cn(
                  'pointer-events-auto relative overflow-hidden rounded-xl border border-secondary p-0 shadow-[var(--dashboard-shell-shadow-lg)]',
                  toast.motionEnabled !== false &&
                    `animate-in fade-in-0 ${getEntryAnimationClass(toast.position)}`,
                  intentClasses[toast.intent],
                )}
                style={
                  toast.motionEnabled === false
                    ? undefined
                    : {
                        animationDuration: `${toast.motionDurationMs ?? 220}ms`,
                      }
                }
              >
                <span
                  className={cn(
                    'absolute inset-y-0 left-0 w-1',
                    intentAccentClasses[toast.intent].bar,
                  )}
                />
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      intentAccentClasses[toast.intent].iconBg,
                      intentAccentClasses[toast.intent].iconFg,
                    )}
                  >
                    <ToastIntentIcon intent={toast.intent} />
                  </span>
                  <div className="min-w-0 flex-1 pl-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="m-0 text-sm font-semibold text-primary">{toast.title}</p>
                        {toast.description ? (
                          <p className="mt-1 text-sm leading-5 text-secondary">{toast.description}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => onDismiss(toast.id)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-base leading-none text-tertiary transition hover:bg-secondary_subtle hover:text-primary"
                        aria-label={`Dismiss ${toast.title} toast`}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    {toast.meta ? <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-tertiary">{toast.meta}</div> : null}
                    {toast.actionLabel && toast.onAction ? (
                      <button
                        type="button"
                        onClick={() => {
                          void toast.onAction?.();
                        }}
                        className="mt-2 inline-flex items-center rounded-lg bg-secondary_subtle px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary_hover"
                      >
                        {toast.actionLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null,
      )}
    </>
  );
}
