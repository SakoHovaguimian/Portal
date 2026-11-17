import { DomainError } from '@/errors/domainErrors';
import { strings } from '@/strings';

import type { MutationErrorProps } from './models/mutationErrorProps';

export function MutationError({ error, id }: MutationErrorProps) {

  if (!error) { return null; }
  return (
    <p
      id={id}
      role="alert"
      className="rounded-xl border border-error_subtle bg-error-primary px-4 py-3 text-sm text-error-primary"
    >
      {error instanceof DomainError && error.status < 500
        ? error.message
        : strings.errors.requestFailed}
    </p>
  );

}
