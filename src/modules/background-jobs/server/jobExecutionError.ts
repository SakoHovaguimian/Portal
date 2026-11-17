import 'server-only';

/** Only trusted handler failures carry an authored, safe user-facing message. */
export class JobExecutionError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly retryable: boolean
  ) { super(message); }
}
