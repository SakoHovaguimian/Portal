'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertModal, SheetPanel, ToastStack, type ToastItem } from '@semantic-web/ui';
import type {
  AlertPresentation,
  PresentationMotionOverride,
  PresentationRequest,
  SheetPresentation,
  ToastPresentation,
} from './types';

type AlertQueueItem = Omit<AlertPresentation, 'kind'> & {
  kind: 'alert';
  id: string;
  resolve: (value: boolean) => void;
};

type SheetQueueItem = Omit<SheetPresentation, 'kind'> & {
  kind: 'sheet';
  id: string;
  resolve: (value: boolean) => void;
};

type OverlayQueueItem = AlertQueueItem | SheetQueueItem;
type OverlayQueueConfig = Omit<AlertQueueItem, 'resolve'> | Omit<SheetQueueItem, 'resolve'>;

type PresentationMotionConfig = {
  enabled: boolean;
  toastDurationMs: number;
  alertDurationMs: number;
  sheetDurationMs: number;
};

type MotionTarget = 'toast' | 'alert' | 'sheet';

const defaultMotion: PresentationMotionConfig = {
  enabled: true,
  toastDurationMs: 220,
  alertDurationMs: 240,
  sheetDurationMs: 260,
};

type PresentationService = {
  present: (request: PresentationRequest) => Promise<string | boolean>;
  showToast: (request: Omit<ToastPresentation, 'kind'>) => Promise<string>;
  showAlert: (request: Omit<AlertPresentation, 'kind'>) => Promise<boolean>;
  showSheet: (request: Omit<SheetPresentation, 'kind'>) => Promise<boolean>;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  getMotionConfig: () => PresentationMotionConfig;
  setMotionConfig: (config: Partial<PresentationMotionConfig>) => void;
};

const PresentationContext = createContext<PresentationService | null>(null);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<OverlayQueueItem | null>(null);
  const [motionConfig, setMotionConfig] = useState<PresentationMotionConfig>(defaultMotion);
  const queueRef = useRef<OverlayQueueItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const resolveMotion = useCallback(
    (target: MotionTarget, override?: PresentationMotionOverride) => {
      const durationKey =
        target === 'toast'
          ? motionConfig.toastDurationMs
          : target === 'alert'
            ? motionConfig.alertDurationMs
            : motionConfig.sheetDurationMs;

      return {
        enabled: override?.enabled ?? motionConfig.enabled,
        durationMs: override?.durationMs ?? durationKey,
      };
    },
    [motionConfig],
  );

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const advanceOverlayQueue = useCallback(() => {
    const next = queueRef.current.shift() ?? null;
    setActiveOverlay(next);
  }, []);

  const enqueueOverlay = useCallback(
    (overlay: OverlayQueueConfig) =>
      new Promise<boolean>((resolve) => {
        const queueItem = { ...overlay, resolve } as OverlayQueueItem;

        if (activeOverlay) {
          queueRef.current.push(queueItem);
          return;
        }

        setActiveOverlay(queueItem);
      }),
    [activeOverlay],
  );

  const showToast = useCallback(
    async (request: Omit<ToastPresentation, 'kind'>) => {
      const id = crypto.randomUUID();
      const motion = resolveMotion('toast', request.motion);
      const toast: ToastItem = {
        id,
        title: request.title,
        description: request.description,
        intent: request.intent ?? 'info',
        position: request.position ?? 'top-right',
        actionLabel: request.actionLabel,
        onAction: request.onAction,
        meta: request.meta,
        motionEnabled: motion.enabled,
        motionDurationMs: motion.durationMs,
      };

      setToasts((current) => [...current, toast]);
      const timer = setTimeout(() => dismissToast(id), request.durationMs ?? 4200);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast, resolveMotion],
  );

  const showAlert = useCallback(
    async (request: Omit<AlertPresentation, 'kind'>) => {
      const id = crypto.randomUUID();
      return enqueueOverlay({
        kind: 'alert',
        id,
        title: request.title,
        description: request.description,
        tone: request.tone,
        alignment: request.alignment,
        confirmLabel: request.confirmLabel,
        cancelLabel: request.cancelLabel,
        details: request.details,
        motion: request.motion,
      });
    },
    [enqueueOverlay],
  );

  const showSheet = useCallback(
    async (request: Omit<SheetPresentation, 'kind'>) => {
      const id = crypto.randomUUID();
      return enqueueOverlay({
        kind: 'sheet',
        id,
        title: request.title,
        description: request.description,
        tone: request.tone,
        side: request.side,
        size: request.size,
        confirmLabel: request.confirmLabel,
        cancelLabel: request.cancelLabel,
        details: request.details,
        content: request.content,
        motion: request.motion,
      });
    },
    [enqueueOverlay],
  );

  const resolveOverlay = useCallback(
    (value: boolean) => {
      setActiveOverlay((current) => {
        if (!current) {
          return current;
        }
        current.resolve(value);
        return null;
      });
      queueMicrotask(advanceOverlayQueue);
    },
    [advanceOverlayQueue],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  const service = useMemo<PresentationService>(
    () => ({
      present: (request) => {
        if (request.kind === 'toast') {
          return showToast(request);
        }
        if (request.kind === 'alert') {
          return showAlert(request);
        }
        return showSheet(request);
      },
      showToast,
      showAlert,
      showSheet,
      dismissToast,
      clearToasts,
      getMotionConfig: () => motionConfig,
      setMotionConfig: (config) =>
        setMotionConfig((current) => ({
          ...current,
          ...config,
        })),
    }),
    [clearToasts, dismissToast, motionConfig, showAlert, showSheet, showToast],
  );

  return (
    <PresentationContext.Provider value={service}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <AlertModal
        open={activeOverlay?.kind === 'alert'}
        title={activeOverlay?.kind === 'alert' ? activeOverlay.title : ''}
        description={activeOverlay?.kind === 'alert' ? activeOverlay.description : ''}
        tone={activeOverlay?.kind === 'alert' ? activeOverlay.tone : undefined}
        alignment={activeOverlay?.kind === 'alert' ? activeOverlay.alignment : undefined}
        confirmLabel={activeOverlay?.kind === 'alert' ? activeOverlay.confirmLabel : undefined}
        cancelLabel={activeOverlay?.kind === 'alert' ? activeOverlay.cancelLabel : undefined}
        details={activeOverlay?.kind === 'alert' ? activeOverlay.details : undefined}
        motionEnabled={
          activeOverlay?.kind === 'alert'
            ? resolveMotion('alert', activeOverlay.motion).enabled
            : motionConfig.enabled
        }
        motionDurationMs={
          activeOverlay?.kind === 'alert'
            ? resolveMotion('alert', activeOverlay.motion).durationMs
            : motionConfig.alertDurationMs
        }
        onCancel={() => resolveOverlay(false)}
        onConfirm={() => resolveOverlay(true)}
      />
      <SheetPanel
        open={activeOverlay?.kind === 'sheet'}
        title={activeOverlay?.kind === 'sheet' ? activeOverlay.title : ''}
        description={activeOverlay?.kind === 'sheet' ? activeOverlay.description : undefined}
        tone={activeOverlay?.kind === 'sheet' ? activeOverlay.tone : undefined}
        side={activeOverlay?.kind === 'sheet' ? activeOverlay.side : undefined}
        size={activeOverlay?.kind === 'sheet' ? activeOverlay.size : undefined}
        confirmLabel={activeOverlay?.kind === 'sheet' ? activeOverlay.confirmLabel : undefined}
        cancelLabel={activeOverlay?.kind === 'sheet' ? activeOverlay.cancelLabel : undefined}
        details={activeOverlay?.kind === 'sheet' ? activeOverlay.details : undefined}
        content={activeOverlay?.kind === 'sheet' ? activeOverlay.content : undefined}
        motionEnabled={
          activeOverlay?.kind === 'sheet'
            ? resolveMotion('sheet', activeOverlay.motion).enabled
            : motionConfig.enabled
        }
        motionDurationMs={
          activeOverlay?.kind === 'sheet'
            ? resolveMotion('sheet', activeOverlay.motion).durationMs
            : motionConfig.sheetDurationMs
        }
        onCancel={() => resolveOverlay(false)}
        onConfirm={() => resolveOverlay(true)}
      />
    </PresentationContext.Provider>
  );
}

export function usePresentationService() {
  const value = useContext(PresentationContext);
  if (!value) {
    throw new Error('Presentation service not available');
  }
  return value;
}
