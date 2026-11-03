import 'server-only';
const owner = globalThis as typeof globalThis & {
  portalDemoResetters?: Map<string, () => void>;
};
const registry = () => (owner.portalDemoResetters ??= new Map());
export function registerDemoReset(key: string, reset: () => void) {
  registry().set(key, reset);
}
export function resetRegisteredDemoState() {
  for (const reset of registry().values()) reset();
}

const accountOwner = globalThis as typeof globalThis & {
  portalDemoAccountResetters?: Map<string, (userId: string) => void>;
};
export function registerDemoAccountReset(
  key: string,
  reset: (userId: string) => void,
) {
  (accountOwner.portalDemoAccountResetters ??= new Map()).set(key, reset);
}
export function resetDemoAccountState(userId: string) {
  for (const reset of accountOwner.portalDemoAccountResetters?.values() ?? [])
    reset(userId);
}
