import type { AppSession } from '@/models/appSession';

export interface AuthSessionCreationResponse extends AppSession {
  onboardingRequired?: boolean;
}
