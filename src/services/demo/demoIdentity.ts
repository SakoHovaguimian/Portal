import 'server-only';
import type { UserRole } from '@/models/userRole';
import type { ServerSession } from '@/services/session/models/serverSession';
import { AuthError } from '@/errors/domainErrors';
import { portalDemoStrings as copy } from '@/strings';
import { getDemoState } from './demoState';
import { DemoFirebaseAuthService } from './demoFirebaseAuthService';
import type { DemoPreset } from './models/demoPreset';
import { resetDemoAccountState } from './demoResetRegistry';
import { demoPresetIds } from './demoPresets';
import { restartDemoOnboarding } from '@/modules/onboarding/demo/onboardingState';

// **************************************
// MARK: - CREATE DEMO IDENTITY SESSION
// **************************************

export async function createDemoIdentitySession(
  preset: DemoPreset | UserRole,
): Promise<ServerSession> {

  const key = preset === 'user' ? 'populated' : preset;
  const user = getDemoState().users.find(
    (user) => user.id === demoPresetIds[key] && !user.disabled && !user.deleted,
  );
  if (!user) { throw new AuthError(copy.accountUnavailable, 409); }
  if (key === 'onboarding') {

    resetDemoAccountState(user.id);
    restartDemoOnboarding(user.id);

  }
  const auth = await new DemoFirebaseAuthService().signIn(
    user.email,
    copy.seedPassword,
  );
  return {
    auth,
    demo: true,
    user: {
      id: user.id,
      externalId: user.external_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    },
  };

}
