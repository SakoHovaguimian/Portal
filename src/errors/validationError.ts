import { strings } from '@/strings';

import { DomainError } from './domainError';

export class ValidationError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.validationFailed,
    public readonly issues?: unknown
  ) {

    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';

  }
}
