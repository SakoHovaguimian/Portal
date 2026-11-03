export type NavigationGuard = () => boolean | Promise<boolean>;

export interface NavigationGuardService {
  register: (guard: NavigationGuard) => () => void;
  confirmNavigation: NavigationGuard;
  /** Return through a known in-app entry; replace with fallback on direct entry. */
  back: (fallback: string) => Promise<boolean>;
}
