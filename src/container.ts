import 'server-only'
import { ApiClient } from './services/api/apiClient'
import { FirebaseAuthService } from './services/auth/firebaseAuthService'
import { SessionService } from './services/session/sessionService'

export class ServiceContainer {

  readonly apiClient: ApiClient
  readonly firebaseAuthService: FirebaseAuthService
  readonly sessionService: SessionService

  constructor() {

    this.apiClient = new ApiClient()
    this.firebaseAuthService = new FirebaseAuthService()
    this.sessionService = new SessionService(this.firebaseAuthService)

  }

}

export const container = new ServiceContainer()
