import type { NavigationGuard } from './navigationGuard';

export interface NavigationGuardService {

  confirmNavigation: NavigationGuard;

  register: (guard: NavigationGuard) => () => void;

  /** Return through a known in-app entry; replace with fallback on direct entry. */
  back: (fallback: string) => Promise<boolean>;

}
