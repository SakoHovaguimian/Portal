import { strings } from '@/strings';
import { DomainError } from './domainError';

export class UnknownAppError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.unknownApplicationError,
    public readonly causeValue?: unknown
  ) {

    super(message, 'UNKNOWN_APP_ERROR', 500);
    this.name = 'UnknownAppError';

  }
}
