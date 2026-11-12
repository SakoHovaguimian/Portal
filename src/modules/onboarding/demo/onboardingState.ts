import 'server-only';

import { demoPresetForUser } from '@/services/demo/demoPresets';
import { registerDemoReset } from '@/services/demo/demoResetRegistry';
import { getDemoState } from '@/services/demo/demoState';
import type { DemoUser } from '@/services/demo/models/demoUser';

import type { OnboardingProgress } from '../models/onboardingProgress';

const globalState = globalThis as typeof globalThis & {
  portalOnboarding?: Map<string, OnboardingProgress>;
};

// **************************************
// MARK: - GET DEMO ONBOARDING STATE
// **************************************

const getOnboardingState = () => (globalState.portalOnboarding ??= new Map());

// **************************************
// MARK: - CREATE INITIAL DEMO ONBOARDING PROGRESS
// **************************************

function createInitialProgress(user: DemoUser, incomplete: boolean): OnboardingProgress {

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

// **************************************
// MARK: - GET DEMO ONBOARDING PROGRESS
// **************************************

export function getDemoOnboardingProgress(user: DemoUser) {

  const existingProgress = getOnboardingState().get(user.id);
  if (existingProgress) { return existingProgress; }

  const progress = createInitialProgress(user, demoPresetForUser(user.id) === 'onboarding');
  getOnboardingState().set(user.id, progress);
  return progress;

}

// **************************************
// MARK: - CREATE DEMO ONBOARDING PROGRESS
// **************************************

export function createDemoOnboarding(user: DemoUser) {

  const progress = createInitialProgress(user, true);
  getOnboardingState().set(user.id, progress);
  return progress;

}

// **************************************
// MARK: - RESTART DEMO ONBOARDING
// **************************************

export function restartDemoOnboarding(userId: string) {

  const user = getDemoState().users.find((user) => user.id === userId);
  if (user) { createDemoOnboarding(user); }

}

// **************************************
// MARK: - RESET DEMO ONBOARDING STATE
// **************************************

export function resetDemoOnboardingState() {
  getOnboardingState().clear();
}

registerDemoReset('onboarding', resetDemoOnboardingState);
