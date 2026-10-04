import { strings } from '@/strings';
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code = 'DOMAIN_ERROR',
    public readonly status = 400,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ApiError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.apiRequestFailed,
    status = 500,
    public readonly causeBody?: unknown,
  ) {
    super(message, 'API_ERROR', status);
    this.name = 'ApiError';
  }
}

export class AuthError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.authenticationRequired,
    status = 401,
  ) {
    super(message, 'AUTH_ERROR', status);
    this.name = 'AuthError';
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.validationFailed,
    public readonly issues?: unknown,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class OwnershipError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors
      .youDoNotHavePermissionToPerformThisAction,
  ) {
    super(message, 'OWNERSHIP_ERROR', 403);
    this.name = 'OwnershipError';
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = strings.ui.domainErrors.resourceNotFound) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnknownAppError extends DomainError {
  constructor(
    message: string = strings.ui.domainErrors.unknownApplicationError,
    public readonly causeValue?: unknown,
  ) {
    super(message, 'UNKNOWN_APP_ERROR', 500);
    this.name = 'UnknownAppError';
  }
}
