import type { NavigationGuard } from './models/navigationGuard';

/** Preserve native Link navigation when all registered guards are synchronous. */
export function confirmNavigationGuards(
  guards: NavigationGuard[],
  start = 0,
): boolean | Promise<boolean> {

  for (let index = start; index < guards.length; index++) {

    const allowed = guards[index]();
    if (typeof allowed !== 'boolean') {

      const confirmationPromise = allowed.then((confirmed) =>
        confirmed ? confirmNavigationGuards(guards, index + 1) : false,
      );

      return confirmationPromise;

    }
    if (!allowed) { return false; }

  }
  return true;

}
