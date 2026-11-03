'use client';

import type { SheetTone } from '../models/sheetTone';
import type { SheetSide } from '../models/sheetSide';
import type { SheetSize } from '../models/sheetSize';
import type { SheetPanelProps } from '../models/sheetPanelProps';
import { labels, strings } from '@/strings';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type CSSProperties } from 'react';
import { Button } from './Button';
import { cn } from '../lib/cn';

export type { SheetTone } from '../models/sheetTone';

export type { SheetSide } from '../models/sheetSide';

export type { SheetSize } from '../models/sheetSize';

const toneClasses: Record<SheetTone, string> = {
  neutral: 'border-secondary',
  info: 'border-brand-secondary/60',
  success: 'border-success-secondary/70',
  warning: 'border-warning-secondary/70',
  danger: 'border-error-secondary/70',
};

const accentClasses: Record<SheetTone, string> = {
  neutral: 'bg-secondary_subtle text-primary',
  info: 'bg-brand-primary/20 text-brand-secondary',
  success: 'bg-success-secondary/25 text-success-primary',
  warning: 'bg-warning-secondary/35 text-warning-primary',
  danger: 'bg-error-secondary/25 text-error-primary',
};

const sideClasses: Record<SheetSide, string> = {
  left: 'left-0 top-0 h-dvh rounded-none rounded-r-overlay',
  right: 'right-0 top-0 h-dvh rounded-none rounded-l-overlay',
  bottom:
    'bottom-0 left-1/2 w-[min(96vw,72rem)] -translate-x-1/2 rounded-t-overlay rounded-b-none',
};

const sizeClasses: Record<SheetSide, Record<SheetSize, string>> = {
  left: {
    sm: 'w-[min(92vw,24rem)]',
    md: 'w-[min(92vw,32rem)]',
    lg: 'w-[min(94vw,40rem)]',
  },
  right: {
    sm: 'w-[min(92vw,24rem)]',
    md: 'w-[min(92vw,32rem)]',
    lg: 'w-[min(94vw,40rem)]',
  },
  bottom: {
    sm: 'min-h-[min(18rem,92dvh)]',
    md: 'min-h-[min(24rem,92dvh)]',
    lg: 'min-h-[min(32rem,92dvh)]',
  },
};

export function SheetPanel({
  open,
  title,
  description,
  tone = 'neutral',
  side = 'right',
  size = 'md',
  confirmLabel = strings.ui.sheetPanel.continue,
  cancelLabel = strings.ui.sheetPanel.close,
  onCancel,
  onConfirm,
  details,
  content,
  motionEnabled = true,
  motionDurationMs,
}: SheetPanelProps) {

  const returnFocusRef = useRef<HTMLElement | null>(null);

  function renderContent() {

    function renderHeader() {

      return (
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-chip px-3 py-1 text-xs font-semibold tracking-[0.16em]',
              accentClasses[tone],
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
            {labels.sides[side]}
          </div>
          <div className="min-w-0 flex-1">
            <Dialog.Title className="font-display text-2xl font-semibold tracking-tight text-primary">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-2 text-sm leading-6 text-secondary">
                {description}
              </Dialog.Description>
            ) : null}
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

    function renderBody() {

      return (
        content ? (
          <div className="min-h-0 flex-1 overflow-auto">{content}</div>
        ) : null
      );

    }

    function renderActions() {

      return (
        <div className="mt-auto flex flex-wrap justify-end gap-3 border-t-control border-secondary pt-5">
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
      <div className="flex h-full w-full flex-col gap-5 p-6">
        {renderHeader()}

        {renderDetails()}

        {renderBody()}

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
          data-side={side}
          data-motion={motionEnabled ? undefined : 'off'}
          {...(!description ? { 'aria-describedby': undefined } : {})}
          onOpenAutoFocus={() => {

            returnFocusRef.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

          }}
          onCloseAutoFocus={(event) => {

            event.preventDefault();
            if (returnFocusRef.current?.isConnected) {
              returnFocusRef.current.focus();
            }

          }}
          className={cn(
            'ui-sheet fixed z-90 flex max-h-dvh overflow-y-auto border-control bg-primary shadow-(--shadow-overlay) outline-none',
            toneClasses[tone],
            sideClasses[side],
            sizeClasses[side][size],
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
