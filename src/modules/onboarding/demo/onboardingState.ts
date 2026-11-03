import 'server-only';
import type { DemoUser } from '@/services/demo/models/demoUser';
import { demoPresetForUser } from '@/services/demo/demoPresets';
import { getDemoState } from '@/services/demo/demoState';
import { registerDemoReset } from '@/services/demo/demoResetRegistry';
import type { OnboardingProgress } from '../models/onboardingProgress';
const globalState = globalThis as typeof globalThis & {
  portalOnboarding?: Map<string, OnboardingProgress>;
};
const state = () => (globalState.portalOnboarding ??= new Map());
function initial(user: DemoUser, incomplete: boolean): OnboardingProgress {
  const now = new Date().toISOString();
  return {
    currentStep: incomplete ? 'profile' : 'review',
    completedSteps: incomplete ? [] : ['profile', 'preferences', 'review'],
    profile: { firstName: user.first_name, lastName: user.last_name },
    preferences: { timezone: 'America/Los_Angeles', emailDigest: false },
    completedAt: incomplete ? null : now,
    updatedAt: now,
  };
}
export function getDemoOnboardingProgress(user: DemoUser) {
  const existing = state().get(user.id);
  if (existing) return existing;
  const progress = initial(user, demoPresetForUser(user.id) === 'onboarding');
  state().set(user.id, progress);
  return progress;
}
export function createDemoOnboarding(user: DemoUser) {
  const progress = initial(user, true);
  state().set(user.id, progress);
  return progress;
}
export function restartDemoOnboarding(userId: string) {
  const user = getDemoState().users.find((user) => user.id === userId);
  if (user) createDemoOnboarding(user);
}
export function resetDemoOnboardingState() {
  state().clear();
}
registerDemoReset('onboarding', resetDemoOnboardingState);
