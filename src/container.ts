import 'server-only';
import { environment } from '@/config/environment';
import { ApiClient } from '@/services/api/apiClient';
import { DemoApiClient } from '@/services/demo/demoApiClient';
import { DemoFirebaseAuthService } from '@/services/demo/demoFirebaseAuthService';
import { FirebaseAuthService } from '@/services/auth/firebaseAuthService';
import { SessionService } from '@/services/session/sessionService';
export class ServiceContainer {
  readonly apiClient = new ApiClient();
  readonly demoApiClient = new DemoApiClient();
  readonly firebaseAuthService = environment.demoMode
    ? new DemoFirebaseAuthService()
    : new FirebaseAuthService();
  readonly sessionService = new SessionService(this.firebaseAuthService);
}
export const container = new ServiceContainer();
