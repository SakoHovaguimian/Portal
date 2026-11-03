import 'server-only';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import { OwnershipError, ValidationError } from '@/errors/domainErrors';
import { portalOnboardingStrings as copy } from '@/strings';
import { OnboardingUpdateSchema } from '../models/onboardingUpdate';
import { getDemoOnboardingProgress } from './onboardingState';
export const handleDemoOnboardingRequest: DemoRequestHandler = async ({
  request,
  parts,
  current,
  json,
  input,
}) => {
  if (parts[0] !== 'onboarding' || parts.length !== 1) return null;
  const progress = getDemoOnboardingProgress(current);
  if (request.method === 'GET') return json(progress);
  if (request.method !== 'PATCH') return null;
  const update = OnboardingUpdateSchema.parse(await input());
  if (update.step === 'profile') {
    progress.profile = update.input;
    current.first_name = update.input.firstName;
    current.last_name = update.input.lastName;
    current.updated_at = new Date().toISOString();
    if (!progress.completedSteps.includes('profile'))
      progress.completedSteps.push('profile');
    progress.currentStep = 'preferences';
  } else if (update.step === 'preferences') {
    if (!progress.completedSteps.includes('profile'))
      throw new ValidationError(copy.invalidStep);
    progress.preferences = update.input;
    if (!progress.completedSteps.includes('preferences'))
      progress.completedSteps.push('preferences');
    progress.currentStep = 'review';
  } else {
    if (
      !progress.completedSteps.includes('profile') ||
      !progress.completedSteps.includes('preferences')
    )
      throw new OwnershipError(copy.invalidStep);
    if (!progress.completedAt) progress.completedAt = new Date().toISOString();
    if (!progress.completedSteps.includes('review'))
      progress.completedSteps.push('review');
    progress.currentStep = 'review';
  }
  progress.updatedAt = new Date().toISOString();
  return json(progress);
};
