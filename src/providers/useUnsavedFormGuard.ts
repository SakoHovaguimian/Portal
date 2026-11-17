'use client';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

import { useNavigationGuard } from './NavigationGuardProvider';

function confirmFormLeave(
  dirty: RefObject<boolean>,
  busy: RefObject<boolean>,
  confirmDiscard: () => Promise<boolean>,
) {

  if (busy.current) { return false; }
  if (!dirty.current) { return true; }
  return confirmDiscard();

}

export function useUnsavedFormGuard(
  dirty: RefObject<boolean>,
  busy: RefObject<boolean>,
  description: string = strings.common.unsavedDescription,
) {

  const { register } = useNavigationGuard();
  const { showAlert } = usePresentationService();
  const pendingConfirmation = useRef<Promise<boolean> | null>(null);
  const confirmLeave = useCallback(
    () => {

      const leavePermission = confirmFormLeave(dirty, busy, () => {

        if (pendingConfirmation.current) { return pendingConfirmation.current; }
        const confirmation = showAlert({
          title: strings.common.unsavedTitle,
          description,
          tone: 'danger',
          confirmLabel: strings.common.discardChanges,
          cancelLabel: strings.common.keepEditing,
        }).then((confirmed) => {

          // The accepted discard must also release native unload and any
          // subsequent guard check while the destination is being loaded.
          // A new edit marks the form dirty again through its existing owner.
          if (confirmed) { dirty.current = false; }
          return confirmed;

        });
        pendingConfirmation.current = confirmation;
        void confirmation.finally(() => {

          if (pendingConfirmation.current === confirmation) { pendingConfirmation.current = null; }

        });
        return confirmation;

      });

      return leavePermission;

    },
    [busy, dirty, showAlert, description],
  );
  // Dialog dismissal callers retain the asynchronous API; the registered
  // guard remains synchronous for clean browser-link navigation.
  const requestLeave = useCallback(
    () => Promise.resolve(confirmLeave()),
    [confirmLeave],
  );
  useEffect(() => {

    const unregister = register(confirmLeave);
    const beforeUnload = (event: BeforeUnloadEvent) => {

      if (!dirty.current && !busy.current) { return; }
      event.preventDefault();
      event.returnValue = '';

    };
    window.addEventListener('beforeunload', beforeUnload);
    const cleanup = () => {

      unregister();
      window.removeEventListener('beforeunload', beforeUnload);

    };

    return cleanup;

  }, [register, confirmLeave, dirty, busy]);
  return requestLeave;

}
