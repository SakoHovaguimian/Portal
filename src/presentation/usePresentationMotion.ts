'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { defaultAppearancePreference } from '@/models/appearancePreference';
import { ThemeIdSchema } from '@/models/themeId';
import { getTheme } from '@/themes';
import { PresentationMotionPreferenceService, presentationMotionStorageKey, presentationMotionChangeEvent } from '@/services/presentation-motion/presentationMotionPreferenceService';
import { PresentationMotionConfigSchema, defaultPresentationMotionConfig, type PresentationMotionConfig } from './models/presentationMotionConfig';
import type { ResolvedPresentationMotionConfig } from './models/resolvedPresentationMotionConfig';
import type { ResolvedPresentationMotion } from './models/resolvedPresentationMotion';
import type { MotionTarget } from './models/motionTarget';
import type { PresentationMotionOverride } from './models/presentationMotionOverride';

export function usePresentationMotion(service?: PresentationMotionPreferenceService) {

  const [fallbackService] = useState(() => new PresentationMotionPreferenceService());
  const preferenceService = service ?? fallbackService;
  const [motionConfig, setMotionConfigState] = useState<PresentationMotionConfig>(defaultPresentationMotionConfig);
  const savedRef = useRef(motionConfig);
  const [previews, setPreviews] = useState(new Map<string, Partial<PresentationMotionConfig>>());
  const [themeId, setThemeId] = useState(defaultAppearancePreference.themeId);
  const [reducedMotion, setReducedMotion] = useState(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {

    let active = true;
    let revision = 0;
    const restore = () => {

      const restoringRevision = ++revision;
      void preferenceService.getPreference().then((saved) => {

        if (!active || revision !== restoringRevision) { return; }
        savedRef.current = saved;
        setMotionConfigState(saved);

      });

    };
    const storage = (event: StorageEvent) => {

      if (event.key === presentationMotionStorageKey || event.key === null) { restore(); }

    };
    restore();
    window.addEventListener('storage', storage);
    window.addEventListener(presentationMotionChangeEvent, restore);
    const cleanup = () => {

      active = false;
      window.removeEventListener('storage', storage);
      window.removeEventListener(presentationMotionChangeEvent, restore);

    };
    return cleanup;

  }, [preferenceService]);

  useEffect(() => {

    const device = window.matchMedia('(prefers-reduced-motion: reduce)');
    const synchronize = () => {

      const root = document.documentElement;
      const selected = ThemeIdSchema.safeParse(root.dataset.themeId);
      setThemeId(selected.success ? selected.data : defaultAppearancePreference.themeId);
      setReducedMotion(root.dataset.motion === 'reduced' || device.matches);

    };
    const observer = new MutationObserver(synchronize);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme-id', 'data-motion'] });
    device.addEventListener('change', synchronize);
    synchronize();
    const cleanup = () => {

      observer.disconnect();
      device.removeEventListener('change', synchronize);

    };
    return cleanup;

  }, []);

  const defaults = useMemo<ResolvedPresentationMotionConfig>(() => {

    const theme = getTheme(themeId);
    const duration = Math.min(1000, Math.round(theme.motion.enter * 1.5));
    return { enabled: true, alertDurationMs: duration, sheetDurationMs: duration, toastDurationMs: duration, scale: Math.max(0.88, Math.min(0.96, theme.motion.enterScale - 0.03)), travelPx: 20, easing: 'smooth' };

  }, [themeId]);
  const effectiveMotionConfig = useMemo<ResolvedPresentationMotionConfig>(() => {

    let merged = { ...defaults, ...motionConfig };
    for (const preview of previews.values()) { merged = { ...merged, ...preview }; }
    return { ...merged, enabled: merged.enabled && !reducedMotion };

  }, [defaults, motionConfig, previews, reducedMotion]);
  const easingValue = useCallback((easing: ResolvedPresentationMotionConfig['easing']) => {

    const theme = getTheme(themeId);
    return easing === 'spring' ? theme.motion.spring : easing === 'snappy' ? 'cubic-bezier(0.16, 1, 0.3, 1)' : theme.motion.ease;

  }, [themeId]);

  useEffect(() => {

    const root = document.documentElement;
    const config = effectiveMotionConfig;
    root.style.setProperty('--presentation-alert-duration', `${config.alertDurationMs}ms`);
    root.style.setProperty('--presentation-sheet-duration', `${config.sheetDurationMs}ms`);
    root.style.setProperty('--presentation-toast-duration', `${config.toastDurationMs}ms`);
    root.style.setProperty('--presentation-scale', String(config.scale));
    root.style.setProperty('--presentation-travel', `${config.travelPx}px`);
    root.style.setProperty('--presentation-ease', easingValue(config.easing));
    root.dataset.presentationMotion = config.enabled ? 'on' : 'off';

  }, [effectiveMotionConfig, easingValue]);

  const setMotionConfig = useCallback((patch: Partial<PresentationMotionConfig>) => {

    const operation = saveQueue.current.catch(() => undefined).then(async () => {

      const next = PresentationMotionConfigSchema.parse({ ...savedRef.current, ...patch });
      const saved = await preferenceService.savePreference(next);
      savedRef.current = saved;
      setMotionConfigState(saved);

    });
    saveQueue.current = operation;
    return operation;

  }, [preferenceService]);
  const resetMotionConfig = useCallback(() => {

    const operation = saveQueue.current.catch(() => undefined).then(async () => {

      const saved = await preferenceService.resetPreference();
      savedRef.current = saved;
      setMotionConfigState(saved);

    });
    saveQueue.current = operation;
    return operation;

  }, [preferenceService]);
  const configureMotion = useCallback((patch: Partial<PresentationMotionConfig>) => {

    const preview = PresentationMotionConfigSchema.partial().parse(patch);
    const id = crypto.randomUUID();
    setPreviews((current) => new Map(current).set(id, preview));
    const cleanup = () => {

      setPreviews((current) => {

        const next = new Map(current);
        next.delete(id);
        return next;

      });

    };
    return cleanup;

  }, []);
  const resolveMotion = useCallback((target: MotionTarget, override?: PresentationMotionOverride): ResolvedPresentationMotion => {

    const config = effectiveMotionConfig;
    const duration = target === 'toast' ? config.toastDurationMs : target === 'sheet' ? config.sheetDurationMs : config.alertDurationMs;
    const durationMs = Math.max(0, Math.min(1000, override?.durationMs ?? duration));
    const style = {
      '--ui-overlay-duration': `${durationMs}ms`,
      '--ui-overlay-scale': Math.max(0.88, Math.min(1, override?.scale ?? config.scale)),
      '--ui-overlay-travel': `${Math.max(0, Math.min(64, override?.travelPx ?? config.travelPx))}px`,
      '--ui-overlay-ease': easingValue(override?.easing ?? config.easing),
    } as CSSProperties;
    return { enabled: config.enabled && override?.enabled !== false, durationMs, style };

  }, [effectiveMotionConfig, easingValue]);
  const getMotionDefaults = useCallback(() => defaults, [defaults]);
  const getMotionConfig = useCallback(() => motionConfig, [motionConfig]);
  return { motionConfig, effectiveMotionConfig, reducedMotion, getMotionDefaults, getMotionConfig, setMotionConfig, resetMotionConfig, configureMotion, resolveMotion };

}
