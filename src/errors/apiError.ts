import { strings } from '@/strings';

import { DomainError } from './domainError';

export class ApiError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.apiRequestFailed,
    status = 500,
    public readonly causeBody?: unknown
  ) {

    super(message, 'API_ERROR', status);
    this.name = 'ApiError';

  }
}
