import { strings } from '@/strings';
import { DomainError, UnknownAppError } from '@/errors/domainErrors';

export function normalizeDomainError(error: unknown): DomainError {
  if (error instanceof DomainError) {
    return error;
  }

  if (error instanceof Error) {
    return new UnknownAppError(error.message, error);
  }

  return new UnknownAppError(
    strings.ui.errorHandling.unexpectedNonErrorThrown,
    error,
  );
}
