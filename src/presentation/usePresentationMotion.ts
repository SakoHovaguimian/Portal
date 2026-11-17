'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import { defaultAppearancePreference } from '@/models/appearancePreference';
import { ThemeIdSchema } from '@/models/themeId';
import { presentationMotionStorageKey, presentationMotionChangeEvent, type PresentationMotionPreferenceService } from '@/services/presentation-motion/presentationMotionPreferenceService';
import { getTheme } from '@/themes';
import { resolveThemeOverlayMotion } from '@/themes/resolveThemeOverlayMotion';

import type { MotionTarget } from './models/motionTarget';
import { PresentationMotionConfigSchema, defaultPresentationMotionConfig, type PresentationMotionConfig } from './models/presentationMotionConfig';
import type { PresentationMotionOverride } from './models/presentationMotionOverride';
import type { ResolvedPresentationMotion } from './models/resolvedPresentationMotion';
import type { ResolvedPresentationMotionConfig } from './models/resolvedPresentationMotionConfig';

export function usePresentationMotion(preferenceService: PresentationMotionPreferenceService) {

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
    const alert = resolveThemeOverlayMotion(theme.motion, 'alert');
    return {
      enabled: true,
      modalDurationMs: resolveThemeOverlayMotion(theme.motion, 'modal').duration,
      menuDurationMs: resolveThemeOverlayMotion(theme.motion, 'menu').duration,
      alertDurationMs: alert.duration,
      sheetDurationMs: resolveThemeOverlayMotion(theme.motion, 'sheet').duration,
      toastDurationMs: resolveThemeOverlayMotion(theme.motion, 'toast').duration,
      exitDurationMs: alert.exitDuration,
      scale: alert.scale, travelPx: alert.travel, easing: 'smooth',
    };

  }, [themeId]);
  const overrides = useMemo(() => {

    let merged = { ...motionConfig };
    for (const preview of previews.values()) { merged = { ...merged, ...preview }; }
    return merged;

  }, [motionConfig, previews]);
  const effectiveMotionConfig = useMemo<ResolvedPresentationMotionConfig>(() => {
    return { ...defaults, ...overrides, enabled: overrides.enabled && !reducedMotion };
  }, [defaults, overrides, reducedMotion]);
  const resolveMotion = useCallback((target: MotionTarget, override?: PresentationMotionOverride): ResolvedPresentationMotion => {

    const theme = getTheme(themeId);
    const profile = resolveThemeOverlayMotion(theme.motion, target);
    const durationMs = Math.max(0, Math.min(1000, override?.durationMs ?? overrides[`${target}DurationMs`] ?? profile.duration));
    const exitDurationMs = Math.max(0, Math.min(1000, override?.exitDurationMs ?? overrides.exitDurationMs ?? Math.min(durationMs, profile.exitDuration)));
    const easing = override?.easing ?? overrides.easing;
    const easingValue = easing === 'spring' ? theme.motion.spring : easing === 'snappy' ? 'cubic-bezier(0.16, 1, 0.3, 1)' : easing === 'smooth' ? theme.motion.ease : profile.easing;
    const style = {
      '--ui-overlay-duration': `${durationMs}ms`,
      '--ui-overlay-exit-duration': `${exitDurationMs}ms`,
      '--ui-overlay-scale': Math.max(0.88, Math.min(1, override?.scale ?? overrides.scale ?? profile.scale)),
      '--ui-overlay-travel': `${Math.max(0, Math.min(64, override?.travelPx ?? overrides.travelPx ?? profile.travel))}px`,
      '--ui-overlay-ease': easingValue,
    } as CSSProperties;
    return { enabled: effectiveMotionConfig.enabled && override?.enabled !== false, durationMs, exitDurationMs, style };

  }, [themeId, overrides, effectiveMotionConfig.enabled]);

  useEffect(() => {

    const root = document.documentElement;
    for (const target of ['modal', 'alert', 'sheet', 'menu', 'toast'] as const) {

      const resolved = resolveMotion(target);
      for (const role of ['duration', 'exit-duration', 'scale', 'travel', 'ease']) {
        root.style.setProperty(`--presentation-${target}-${role}`, String(resolved.style[`--ui-overlay-${role}` as keyof CSSProperties]));
      }

    }
    root.dataset.presentationMotion = effectiveMotionConfig.enabled ? 'on' : 'off';
    const cleanup = () => {

      for (const target of ['modal', 'alert', 'sheet', 'menu', 'toast']) {

        for (const role of ['duration', 'exit-duration', 'scale', 'travel', 'ease']) {
          root.style.removeProperty(`--presentation-${target}-${role}`);
        }

      }
      delete root.dataset.presentationMotion;

    };

    return cleanup;

  }, [effectiveMotionConfig.enabled, resolveMotion]);

  const setMotionConfig = useCallback((patch: Partial<PresentationMotionConfig>) => {

    const operation = saveQueue.current.catch(() => undefined).then(async () => {

      const next = PresentationMotionConfigSchema.parse(JSON.parse(JSON.stringify({ ...savedRef.current, ...patch })));
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

    const preview = PresentationMotionConfigSchema.partial().parse(JSON.parse(JSON.stringify(patch)));
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
  const getMotionDefaults = useCallback(() => defaults, [defaults]);
  const getMotionConfig = useCallback(() => motionConfig, [motionConfig]);
  return { motionConfig, effectiveMotionConfig, reducedMotion, getMotionDefaults, getMotionConfig, setMotionConfig, resetMotionConfig, configureMotion, resolveMotion };

}
