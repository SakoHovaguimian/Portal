'use client';

import type { OverlayQueueItem } from './models/overlayQueueItem';
import type { OverlayQueueConfig } from './models/overlayQueueConfig';
import type { PresentationMotionConfig } from './models/presentationMotionConfig';
import type { MotionTarget } from './models/motionTarget';
import type { PresentationService } from './models/presentationService';
import { strings } from '@/strings';
import type { ChildrenProps } from '@/models/childrenProps';
import { motionDuration } from '@/components/ui/lib/motionPreferences';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertModal,
  SheetPanel,
  ToastStack,
  type ToastItem,
} from '@/components/ui';
import type {
  AlertPresentation,
  PresentationMotionOverride,
  SheetPresentation,
  ToastPresentation,
} from './types';

const defaultMotion: PresentationMotionConfig = {
  enabled: true,
};

const PresentationContext = createContext<PresentationService | null>(null);

export function PresentationProvider({ children }: ChildrenProps) {

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<OverlayQueueItem | null>(
    null,
  );
  const activeOverlayRef = useRef<OverlayQueueItem | null>(null);
  const [closedOverlay, setClosedOverlay] = useState<OverlayQueueItem | null>(
    null,
  );
  const resolvedOverlayId = useRef<string | null>(null);
  const alertReturnFocusRef = useRef<HTMLElement | null>(null);
  const [motionConfig, setMotionConfig] =
    useState<PresentationMotionConfig>(defaultMotion);
  const queueRef = useRef<OverlayQueueItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const toastMotionRef = useRef(new Map<string, boolean>());

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

    if (!toastMotionRef.current.has(id)) { return; }
    const timer = timersRef.current.get(id);
    if (timer) {

      clearTimeout(timer);
      timersRef.current.delete(id);

    }
    const duration = toastMotionRef.current.get(id)
      ? motionDuration('--motion-duration-fast')
      : 0;
    if (!duration) {

      toastMotionRef.current.delete(id);
      setToasts((current) => {

        const remainingToasts = current.filter((toast) => toast.id !== id);
        return remainingToasts;

      });
      return;

    }
    setToasts((current) => {

      const exitingToasts = current.map((toast) =>
        toast.id === id ? { ...toast, exiting: true } : toast,
      );

      return exitingToasts;

    },
    );
    timersRef.current.set(
      id,
      setTimeout(() => {

        timersRef.current.delete(id);
        toastMotionRef.current.delete(id);
        setToasts((current) => {

          const remainingToasts = current.filter((toast) => toast.id !== id);
          return remainingToasts;

        });

      }, duration),
    );

  }, []);

  const clearToasts = useCallback(() => {

    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    toastMotionRef.current.clear();
    setToasts([]);

  }, []);

  const advanceOverlayQueue = useCallback(() => {

    const next = queueRef.current.shift() ?? null;
    activeOverlayRef.current = next;
    setActiveOverlay(next);

  }, []);

  const enqueueOverlay = useCallback(
    (overlay: OverlayQueueConfig) => {

      const overlayConfirmation = new Promise<boolean>((resolve) => {

        const queueItem = { ...overlay, resolve } as OverlayQueueItem;

        // Track occupancy synchronously, keeping showAlert/showSheet stable
        // while overlays open/close and preserving same-tick queue requests.
        if (activeOverlayRef.current) {

          queueRef.current.push(queueItem);
          return;

        }

        activeOverlayRef.current = queueItem;
        setActiveOverlay(queueItem);

      });

      return overlayConfirmation;

    },
    [],
  );

  const showToast = useCallback(
    async (request: Omit<ToastPresentation, 'kind'>) => {

      const id = crypto.randomUUID();
      const motion = resolveMotion('toast', request.motion);
      const toast: ToastItem = {
        id,
        title: request.title,
        description: request.description,
        appearance: request.appearance,
        intent: request.intent ?? 'info',
        position: request.position ?? 'top-right',
        actionLabel: request.actionLabel,
        onAction: request.onAction,
        meta: request.meta,
        motionEnabled: motion.enabled,
        motionDurationMs: motion.durationMs,
      };

      toastMotionRef.current.set(id, motion.enabled);
      setToasts((current) => [...current, toast]);
      const timer = setTimeout(
        () => dismissToast(id),
        request.durationMs ?? 4200,
      );
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

      if (!activeOverlay || resolvedOverlayId.current === activeOverlay.id) { return; }
      resolvedOverlayId.current = activeOverlay.id;
      activeOverlay.resolve(value);
      setClosedOverlay(activeOverlay);
      setActiveOverlay(null);
      queueMicrotask(advanceOverlayQueue);

    },
    [activeOverlay, advanceOverlayQueue],
  );

  useEffect(
    () => {

      const cleanup = () => {

        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
        toastMotionRef.current.clear();

      };

      return cleanup;

    },
    [],
  );

  const service = useMemo<PresentationService>(
    () => {

      const presentationService: PresentationService = ({
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
        setMotionConfig: (config) => {

          setMotionConfig((current) => ({
            ...current,
            ...config,
          }));

        },
      });

      return presentationService;

    },
    [clearToasts, dismissToast, motionConfig, showAlert, showSheet, showToast],
  );

  const alert =
    activeOverlay?.kind === 'alert'
      ? activeOverlay
      : closedOverlay?.kind === 'alert'
        ? closedOverlay
        : null;
  const sheet =
    activeOverlay?.kind === 'sheet'
      ? activeOverlay
      : closedOverlay?.kind === 'sheet'
        ? closedOverlay
        : null;

  function renderAlert() {

    return (
      <AlertModal
        key={alert?.id}
        restoreFocusRef={alertReturnFocusRef}
        open={activeOverlay?.kind === 'alert'}
        title={alert?.title ?? ''}
        description={alert?.description ?? ''}
        tone={alert?.tone}
        alignment={alert?.alignment}
        confirmLabel={alert?.confirmLabel}
        cancelLabel={alert?.cancelLabel}
        details={alert?.details}
        motionEnabled={resolveMotion('alert', alert?.motion).enabled}
        motionDurationMs={resolveMotion('alert', alert?.motion).durationMs}
        onCancel={() => resolveOverlay(false)}
        onConfirm={() => resolveOverlay(true)}
      />
    );

  }

  function renderSheet() {

    return (
      <SheetPanel
        open={activeOverlay?.kind === 'sheet'}
        title={sheet?.title ?? ''}
        description={sheet?.description}
        tone={sheet?.tone}
        side={sheet?.side}
        size={sheet?.size}
        confirmLabel={sheet?.confirmLabel}
        cancelLabel={sheet?.cancelLabel}
        details={sheet?.details}
        content={sheet?.content}
        motionEnabled={resolveMotion('sheet', sheet?.motion).enabled}
        motionDurationMs={resolveMotion('sheet', sheet?.motion).durationMs}
        onCancel={() => resolveOverlay(false)}
        onConfirm={() => resolveOverlay(true)}
      />
    );

  }

  return (
    <PresentationContext.Provider value={service}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {renderAlert()}
      {renderSheet()}
    </PresentationContext.Provider>
  );

}

export function usePresentationService() {

  const value = useContext(PresentationContext);
  if (!value) {

    throw new Error(
      strings.ui.presentationProvider.presentationServiceNotAvailable,
    );

  }
  return value;

}
