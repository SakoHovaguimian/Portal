export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code = 'DOMAIN_ERROR',
    public readonly status = 400
  ) {

    super(message);
    this.name = 'DomainError';

  }
}
