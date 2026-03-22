import { DomainError, UnknownAppError } from '../errors/domainErrors';

export function normalizeDomainError(error: unknown): DomainError {
  if (error instanceof DomainError) {
    return error;
  }

  if (error instanceof Error) {
    return new UnknownAppError(error.message, error);
  }

  return new UnknownAppError('Unexpected non-error thrown', error);
}
