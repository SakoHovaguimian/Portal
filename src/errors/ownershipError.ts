import { strings } from '@/strings';

import { DomainError } from './domainError';

export class OwnershipError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors
      .youDoNotHavePermissionToPerformThisActionHint,
  ) {

    super(message, 'OWNERSHIP_ERROR', 403);
    this.name = 'OwnershipError';

  }
}
