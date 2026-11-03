'use client';

import type { OverlayQueueItem } from './models/overlayQueueItem';
import type { OverlayQueueConfig } from './models/overlayQueueConfig';
import type { PresentationService } from './models/presentationService';
import type { PresentationProviderProps } from './models/presentationProviderProps';
import type { ResolvedPresentationMotion } from './models/resolvedPresentationMotion';
import { strings } from '@/strings';
import { prefersReducedMotion } from '@/components/ui/lib/motionPreferences';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertModal, SheetPanel, ToastStack, type ToastItem } from '@/components/ui';
import type { AlertPresentation, SheetPresentation, ToastPresentation } from './types';
import { usePresentationMotion } from './usePresentationMotion';

const PresentationContext = createContext<PresentationService | null>(null);

export function PresentationProvider({ children, service: preferenceService }: PresentationProviderProps) {

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<OverlayQueueItem | null>(null);
  const activeOverlayRef = useRef<OverlayQueueItem | null>(null);
  const [closedOverlay, setClosedOverlay] = useState<OverlayQueueItem | null>(null);
  const closingOverlayRef = useRef<OverlayQueueItem | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertReturnFocusRef = useRef<HTMLElement | null>(null);
  const motion = usePresentationMotion(preferenceService);
  const { resolveMotion } = motion;
  const queueRef = useRef<OverlayQueueItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const toastMotionRef = useRef(new Map<string, ResolvedPresentationMotion>());
  const exitingToastRef = useRef(new Set<string>());

  const removeToast = useCallback((id: string) => {

    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); }
    timersRef.current.delete(id);
    toastMotionRef.current.delete(id);
    exitingToastRef.current.delete(id);
    setToasts((current) => {

      const remaining = current.filter((toast) => toast.id !== id);
      return remaining;

    });

  }, []);
  const dismissToast = useCallback((id: string) => {

    const presentation = toastMotionRef.current.get(id);
    if (!presentation || exitingToastRef.current.has(id)) { return; }
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); }
    const duration = presentation.enabled && !prefersReducedMotion() ? presentation.durationMs : 0;
    if (!duration) {

      removeToast(id);
      return;

    }
    exitingToastRef.current.add(id);
    setToasts((current) => {

      const exiting = current.map((toast) => toast.id === id ? { ...toast, exiting: true } : toast);
      return exiting;

    });
    // Animation completion is authoritative; this bounded fallback handles removed/disabled CSS.
    timersRef.current.set(id, setTimeout(() => removeToast(id), duration + 80));

  }, [removeToast]);
  const clearToasts = useCallback(() => {

    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    toastMotionRef.current.clear();
    exitingToastRef.current.clear();
    setToasts([]);

  }, []);
  const advanceOverlayQueue = useCallback(() => {

    const next = queueRef.current.shift() ?? null;
    activeOverlayRef.current = next;
    setActiveOverlay(next);

  }, []);
  const finishOverlayExit = useCallback((id: string) => {

    if (closingOverlayRef.current?.id !== id) { return; }
    if (overlayTimerRef.current) { clearTimeout(overlayTimerRef.current); }
    overlayTimerRef.current = null;
    closingOverlayRef.current = null;
    activeOverlayRef.current = null;
    setClosedOverlay(null);
    advanceOverlayQueue();

  }, [advanceOverlayQueue]);
  const enqueueOverlay = useCallback((overlay: OverlayQueueConfig) => {

    const confirmation = new Promise<boolean>((resolve) => {

      const queueItem = { ...overlay, resolve, resolvedMotion: resolveMotion(overlay.kind, overlay.motion) } as OverlayQueueItem;
      if (activeOverlayRef.current || closingOverlayRef.current) {

        queueRef.current.push(queueItem);
        return;

      }
      activeOverlayRef.current = queueItem;
      setActiveOverlay(queueItem);

    });

    return confirmation;

  }, [resolveMotion]);
  const showToast = useCallback(async (request: Omit<ToastPresentation, 'kind'>) => {

    const id = crypto.randomUUID();
    const resolved = resolveMotion('toast', request.motion);
    const toast: ToastItem = {
      id, title: request.title, description: request.description, appearance: request.appearance,
      intent: request.intent ?? 'info', position: request.position ?? 'top-right',
      actionLabel: request.actionLabel, onAction: request.onAction, meta: request.meta,
      motionEnabled: resolved.enabled, motionDurationMs: resolved.durationMs, motionStyle: resolved.style,
    };
    toastMotionRef.current.set(id, resolved);
    setToasts((current) => [...current, toast]);
    timersRef.current.set(id, setTimeout(() => dismissToast(id), request.durationMs ?? 4200));
    return id;

  }, [dismissToast, resolveMotion]);
  const showAlert = useCallback(async (request: Omit<AlertPresentation, 'kind'>) => {

    const id = crypto.randomUUID();
    return enqueueOverlay({ ...request, kind: 'alert', id });

  }, [enqueueOverlay]);
  const showSheet = useCallback(async (request: Omit<SheetPresentation, 'kind'>) => {

    const id = crypto.randomUUID();
    return enqueueOverlay({ ...request, kind: 'sheet', id });

  }, [enqueueOverlay]);
  const resolveOverlay = useCallback((value: boolean) => {

    const current = activeOverlayRef.current;
    if (!current || closingOverlayRef.current) { return; }
    closingOverlayRef.current = current;
    // The caller receives its result immediately; only the visual queue waits for exit.
    current.resolve(value);
    setClosedOverlay(current);
    setActiveOverlay(null);
    const duration = current.resolvedMotion.enabled && !prefersReducedMotion() ? current.resolvedMotion.durationMs : 0;
    if (!duration) {
      queueMicrotask(() => finishOverlayExit(current.id));
    } else {
      overlayTimerRef.current = setTimeout(() => finishOverlayExit(current.id), duration + 80);
    }

  }, [finishOverlayExit]);

  useEffect(() => {

    if (motion.effectiveMotionConfig.enabled) { return; }
    const closing = closingOverlayRef.current;
    if (closing) { finishOverlayExit(closing.id); }
    for (const id of exitingToastRef.current) { removeToast(id); }

  }, [motion.effectiveMotionConfig.enabled, finishOverlayExit, removeToast]);
  useEffect(() => {

    const cleanup = () => {

      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
      toastMotionRef.current.clear();
      exitingToastRef.current.clear();
      if (overlayTimerRef.current) { clearTimeout(overlayTimerRef.current); }
      activeOverlayRef.current?.resolve(false);
      queueRef.current.forEach((item) => item.resolve(false));
      queueRef.current = [];

    };

    return cleanup;

  }, []);
  const service = useMemo<PresentationService>(() => {

    const presentation: PresentationService = {
      present: (request) => request.kind === 'toast' ? showToast(request) : request.kind === 'alert' ? showAlert(request) : showSheet(request),
      showToast, showAlert, showSheet, dismissToast, clearToasts,
      motionConfig: motion.motionConfig, effectiveMotionConfig: motion.effectiveMotionConfig,
      reducedMotion: motion.reducedMotion, getMotionDefaults: motion.getMotionDefaults,
      getMotionConfig: motion.getMotionConfig, setMotionConfig: motion.setMotionConfig,
      resetMotionConfig: motion.resetMotionConfig, configureMotion: motion.configureMotion,
    };

    return presentation;

  }, [clearToasts, dismissToast, motion, showAlert, showSheet, showToast]);
  const alert = activeOverlay?.kind === 'alert' ? activeOverlay : closedOverlay?.kind === 'alert' ? closedOverlay : null;
  const sheet = activeOverlay?.kind === 'sheet' ? activeOverlay : closedOverlay?.kind === 'sheet' ? closedOverlay : null;

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
        motionEnabled={alert?.resolvedMotion.enabled}
        motionDurationMs={alert?.resolvedMotion.durationMs}
        motionStyle={alert?.resolvedMotion.style}
        onExitComplete={() => {

          if (alert) { finishOverlayExit(alert.id); }

        }}
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
        motionEnabled={sheet?.resolvedMotion.enabled}
        motionDurationMs={sheet?.resolvedMotion.durationMs}
        motionStyle={sheet?.resolvedMotion.style}
        onExitComplete={() => {

          if (sheet) { finishOverlayExit(sheet.id); }

        }}
        onCancel={() => resolveOverlay(false)}
        onConfirm={() => resolveOverlay(true)}
      />
    );

  }

  return (
    <PresentationContext.Provider value={service}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} onExitComplete={removeToast} />
      {renderAlert()}
      {renderSheet()}
    </PresentationContext.Provider>
  );

}

export function usePresentationService() {

  const value = useContext(PresentationContext);
  if (!value) { throw new Error(strings.ui.presentationProvider.presentationServiceNotAvailable); }
  return value;

}
