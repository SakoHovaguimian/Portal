import type { ApiClientInterface } from '@/services/api/apiClientInterface';

import { OnboardingProgressSchema } from '../models/onboardingProgress';
import {
  OnboardingUpdateSchema,
  type OnboardingUpdate,
} from '../models/onboardingUpdate';

export class OnboardingService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - READ ONBOARDING PROGRESS
  // **************************************

  async read(signal?: AbortSignal) {

    return OnboardingProgressSchema.parse(
      await this.api.request('/onboarding', { signal }),
    );

  }

  // **************************************
  // MARK: - SAVE ONBOARDING PROGRESS
  // **************************************

  async save(input: OnboardingUpdate) {

    return OnboardingProgressSchema.parse(
      await this.api.request('/onboarding', {
        method: 'PATCH',
        body: OnboardingUpdateSchema.parse(input),
      }),
    );

  }

}
