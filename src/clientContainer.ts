import { BrowserApiClient } from './services/api/browserApiClient'

export class ClientServiceContainer {

  readonly apiClient: BrowserApiClient

  constructor() {

    this.apiClient = new BrowserApiClient()
  }

}

export const clientContainer = new ClientServiceContainer()
