import { strings } from '@/strings';

import { DomainError } from './domainError';

export class AuthError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.authenticationRequired,
    status = 401
  ) {

    super(message, 'AUTH_ERROR', status);
    this.name = 'AuthError';

  }
}
