import 'server-only';

// Application configuration
import { environment } from '@/config/environment';

// Foundational services
import { ApiClient } from '@/services/api/apiClient';
import { createDemoModuleHandlers } from '@/services/api/demoModuleHandlers';
import { FirebaseAuthService } from '@/services/auth/firebaseAuthService';
import { DemoApiClient } from '@/services/demo/demoApiClient';
import { DemoFirebaseAuthService } from '@/services/demo/demoFirebaseAuthService';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { SessionService } from '@/services/session/sessionService';

export class ServiceContainer {

  readonly apiClient = new ApiClient();
  readonly demoApiClient = new DemoApiClient(createDemoModuleHandlers());
  readonly firebaseAuthService;
  readonly sessionService;

  constructor(readonly demoMode = environment.demoMode) {

    this.firebaseAuthService = demoMode
      ? new DemoFirebaseAuthService()
      : new FirebaseAuthService();
    this.sessionService = new SessionService(
      this.firebaseAuthService,
      demoMode,
    );

  }

}

const containers = new Map<boolean, ServiceContainer>();

// **************************************
// MARK: - GET SERVICE CONTAINER
// **************************************

export async function getContainer() {

  const { demoMode } = await getEffectiveRuntime();
  let container = containers.get(demoMode);
  if (!container) {

    container = new ServiceContainer(demoMode);
    containers.set(demoMode, container);

  }
  return container;

}
