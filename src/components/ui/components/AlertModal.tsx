'use client';

import type { AlertTone } from '../models/alertTone';
import type { AlertAlignment } from '../models/alertAlignment';
import type { AlertModalProps } from '../models/alertModalProps';
import { labels, strings } from '@/strings';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type CSSProperties } from 'react';
import { Button } from './Button';
import { cn } from '../lib/cn';

export type { AlertTone } from '../models/alertTone';

export type { AlertAlignment } from '../models/alertAlignment';

const toneClasses: Record<AlertTone, string> = {
  neutral: 'border-secondary',
  info: 'border-brand-secondary/60',
  success: 'border-success-secondary/70',
  warning: 'border-warning-secondary/70',
  danger: 'border-error-secondary/70',
};

const accentClasses: Record<AlertTone, string> = {
  neutral: 'bg-secondary_subtle text-primary',
  info: 'bg-brand-primary/20 text-brand-secondary',
  success: 'bg-success-secondary/25 text-success-primary',
  warning: 'bg-warning-secondary/35 text-warning-primary',
  danger: 'bg-error-secondary/25 text-error-primary',
};

const layoutClasses: Record<AlertAlignment, string> = {
  center:
    'left-1/2 top-1/2 w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-overlay',
  top: 'left-1/2 top-6 w-[min(92vw,40rem)] -translate-x-1/2 rounded-overlay',
  right:
    'right-0 top-0 h-dvh w-[min(94vw,34rem)] rounded-none rounded-l-overlay',
};

export function AlertModal({
  open,
  title,
  description,
  tone = 'neutral',
  alignment = 'center',
  confirmLabel = strings.ui.alertModal.confirm,
  cancelLabel = strings.ui.alertModal.cancel,
  onCancel,
  onConfirm,
  details,
  motionEnabled = true,
  motionDurationMs,
  restoreFocusRef,
}: AlertModalProps) {

  const localReturnFocusRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = restoreFocusRef ?? localReturnFocusRef;

  function renderContent() {

    function renderHeader() {

      return (
        <div className="flex flex-col items-start gap-4 text-left">
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-chip px-3 py-1 text-xs font-semibold tracking-[0.16em]',
              accentClasses[tone],
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
            {labels.tones[tone]}
          </div>
          <div className="min-w-0">
            <Dialog.Title className="font-display text-2xl font-semibold tracking-tight text-primary">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-secondary">
              {description}
            </Dialog.Description>
          </div>
        </div>
      );

    }

    function renderDetails() {

      return (
        details ? (
          <div className="rounded-card border-control border-secondary bg-secondary_subtle p-4 text-sm text-secondary">
            {details}
          </div>
        ) : null
      );

    }

    function renderActions() {

      return (
        <div className="mt-auto flex flex-wrap justify-center gap-3 border-t-control border-secondary pt-5">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'destructive' : 'primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      );

    }

    return (
      <div className="flex h-full flex-col gap-5">
        {renderHeader()}
        {renderDetails()}
        {renderActions()}
      </div>
    );

  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : undefined)}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          data-ui-presentation-layer="true"
          data-motion={motionEnabled ? undefined : 'off'}
          className={cn(
            'ui-backdrop fixed inset-0 z-80 bg-(--dashboard-shell-overlay) backdrop-blur-sm',
          )}
          style={
            motionEnabled
              ? ({
                '--ui-overlay-duration':
                    motionDurationMs === undefined
                      ? 'var(--motion-duration-enter)'
                      : `${motionDurationMs}ms`,
              } as CSSProperties)
              : undefined
          }
        />
        <Dialog.Content
          data-ui-presentation-layer="true"
          role="alertdialog"
          data-motion={motionEnabled ? undefined : 'off'}
          onOpenAutoFocus={() => {

            const focused = document.activeElement;
            // Consecutive confirmations share the original workflow trigger.
            if (
              focused instanceof HTMLElement &&
              focused !== document.body &&
              !focused.closest('[role="alertdialog"]')
            ) { returnFocusRef.current = focused; }

          }}
          onCloseAutoFocus={(event) => {

            event.preventDefault();
            // A completed workflow may have focused its result during modal exit.
            // Preserve that deliberate destination instead of restoring the trigger.
            const focused = document.activeElement;
            if (
              focused instanceof HTMLElement &&
              focused !== document.body &&
              event.target instanceof HTMLElement &&
              !event.target.contains(focused)
            ) { return; }
            if (returnFocusRef.current?.isConnected) {
              returnFocusRef.current.focus();
            }

          }}
          className={cn(
            'ui-dialog fixed z-90 max-h-[calc(100dvh-2rem)] overflow-y-auto border-control bg-primary p-6 shadow-(--shadow-overlay) outline-none',
            toneClasses[tone],
            layoutClasses[alignment],
          )}
          style={
            motionEnabled
              ? ({
                '--ui-overlay-duration':
                    motionDurationMs === undefined
                      ? 'var(--motion-duration-enter)'
                      : `${motionDurationMs}ms`,
              } as CSSProperties)
              : undefined
          }
        >
          {renderContent()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

}
