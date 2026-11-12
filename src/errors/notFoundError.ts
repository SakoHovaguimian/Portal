import { strings } from '@/strings';

import { DomainError } from './domainError';

export class NotFoundError extends DomainError {
  constructor(message: string = strings.ui.domainErrors.resourceNotFound) {

    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';

  }
}
