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
  constructor(message = 'API request failed', status = 500, public readonly causeBody?: unknown) {
    super(message, 'API_ERROR', status);
    this.name = 'ApiError';
  }
}

export class AuthError extends DomainError {
  constructor(message = 'Authentication required', status = 401) {
    super(message, 'AUTH_ERROR', status);
    this.name = 'AuthError';
  }
}

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed', public readonly issues?: unknown) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class OwnershipError extends DomainError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'OWNERSHIP_ERROR', 403);
    this.name = 'OwnershipError';
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnknownAppError extends DomainError {
  constructor(message = 'Unknown application error', public readonly causeValue?: unknown) {
    super(message, 'UNKNOWN_APP_ERROR', 500);
    this.name = 'UnknownAppError';
  }
}
