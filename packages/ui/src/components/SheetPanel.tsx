'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '../lib/cn';
import type { AlertTone } from './AlertModal';

export type SheetTone = AlertTone;
export type SheetSide = 'left' | 'right' | 'bottom';
export type SheetSize = 'sm' | 'md' | 'lg';

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
  left: 'left-0 top-0 h-screen rounded-none rounded-r-[2rem]',
  right: 'right-0 top-0 h-screen rounded-none rounded-l-[2rem]',
  bottom: 'bottom-0 left-1/2 w-[min(96vw,72rem)] -translate-x-1/2 rounded-t-[2rem] rounded-b-none',
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
    sm: 'min-h-[18rem]',
    md: 'min-h-[24rem]',
    lg: 'min-h-[32rem]',
  },
};

export function SheetPanel({
  open,
  title,
  description,
  tone = 'neutral',
  side = 'right',
  size = 'md',
  confirmLabel = 'Continue',
  cancelLabel = 'Close',
  onCancel,
  onConfirm,
  details,
  content,
  motionEnabled = true,
  motionDurationMs = 260,
}: {
  open: boolean;
  title: string;
  description?: string;
  tone?: SheetTone;
  side?: SheetSide;
  size?: SheetSize;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  details?: ReactNode;
  content?: ReactNode;
  motionEnabled?: boolean;
  motionDurationMs?: number;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm',
            motionEnabled && 'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          )}
          style={motionEnabled ? { animationDuration: `${motionDurationMs}ms` } : undefined}
        />
        <Dialog.Content
          className={cn(
            'fixed z-[90] flex border bg-primary/98 shadow-[0_30px_90px_rgba(10,13,18,0.24)] backdrop-blur-xl outline-none',
            motionEnabled && 'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            motionEnabled && side === 'left' && 'data-[state=open]:slide-in-from-left-8',
            motionEnabled && side === 'right' && 'data-[state=open]:slide-in-from-right-8',
            motionEnabled && side === 'bottom' && 'data-[state=open]:slide-in-from-bottom-8',
            toneClasses[tone],
            sideClasses[side],
            sizeClasses[side][size],
          )}
          style={motionEnabled ? { animationDuration: `${motionDurationMs}ms` } : undefined}
        >
          <div className="flex h-full w-full flex-col gap-5 p-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
                  accentClasses[tone],
                )}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {side}
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

            {details ? (
              <div className="rounded-3xl border border-secondary bg-secondary_subtle/70 p-4 text-sm text-secondary">
                {details}
              </div>
            ) : null}

            {content ? <div className="min-h-0 flex-1 overflow-auto">{content}</div> : null}

            <div className="mt-auto flex flex-wrap justify-end gap-3 border-t border-secondary pt-5">
              <Button variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={tone === 'danger' ? 'destructive' : 'primary'} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
