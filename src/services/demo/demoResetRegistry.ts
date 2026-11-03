import 'server-only';

const owner = globalThis as typeof globalThis & {
  portalDemoResetters?: Map<string, () => void>;
};

// **************************************
// MARK: - GET DEMO RESET REGISTRY
// **************************************

const registry = () => (owner.portalDemoResetters ??= new Map());

// **************************************
// MARK: - REGISTER DEMO RESET
// **************************************

export function registerDemoReset(key: string, reset: () => void) {
  registry().set(key, reset);
}

// **************************************
// MARK: - RESET REGISTERED DEMO STATE
// **************************************

export function resetRegisteredDemoState() {

  for (const reset of registry().values()) { reset(); }

}

const accountOwner = globalThis as typeof globalThis & {
  portalDemoAccountResetters?: Map<string, (userId: string) => void>;
};

// **************************************
// MARK: - REGISTER DEMO ACCOUNT RESET
// **************************************

export function registerDemoAccountReset(
  key: string,
  reset: (userId: string) => void,
) {
  (accountOwner.portalDemoAccountResetters ??= new Map()).set(key, reset);
}

// **************************************
// MARK: - RESET DEMO ACCOUNT STATE
// **************************************

export function resetDemoAccountState(userId: string) {

  for (const reset of accountOwner.portalDemoAccountResetters?.values() ?? []) { reset(userId); }

}
