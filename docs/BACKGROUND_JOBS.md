# Background Jobs

`src/modules/background-jobs` owns job models, the `BackgroundJobService`, Query hooks, the Jobs directory, the job inspector, sample job definitions, and module-local server handlers. The feature is enabled by `portalModules.backgroundJobs` and appears at `/jobs`. Disabling it removes the navigation and makes its protected pages and API unavailable.

The browser follows the normal domain service → API client → authenticated Next.js proxy path. Ownership comes from the authenticated server session. No owner, worker credentials, access tokens, or backend URL are accepted from the UI. Staff roles cannot inspect another user's jobs. The proxy rejects a successful upstream response containing another owner's data.

## Job Lifecycle

A newly accepted job is `queued`, then becomes `running`, and ends as `succeeded`, `failed`, or `canceled`. The queue stores measured progress (`stage`, `completed`, `total`), creation/update/finish timestamps, the current attempt, bounded attempt history, a structured failure, and an optional JSON result. A queued job shows indeterminate progress; running jobs show the work units actually completed by their handler.

Cancellation is explicit and available only for queued/running work. Repeating a successful cancel is idempotent. Cancellation aborts the execution signal and pending waits; handlers must cooperate with the signal. A terminal successful/failed job cannot be canceled. Canceled work cannot be retried; the user can create a new job.

Retry is an explicit action for a `failed` job whose definition declares `retrySafe`, whose last failure is retryable, and whose maximum attempts have not been used. Retry keeps the same job ID, appends a new attempt, clears the current result/failure/progress, and preserves previous failure history. The request carries `expectedAttempt`, so a stale or racing retry cannot create an unexpected extra attempt. No automatic mutation or worker retry is hidden behind polling.

Each create/retry request carries a UUID `idempotencyKey`. Keys are scoped to the authenticated owner and bind to the complete operation and payload. An exact duplicate returns the current state of the original job. Reusing a key for a different operation/payload returns `409 IDEMPOTENCY_CONFLICT`. The create dialog and inspector preserve their request key for repeated submissions of the same draft/attempt after an uncertain response. An edited draft is a new intent and gets a new key. Reloading the page loses the local request key: inspect the queue before submitting again after an uncertain response.

## Server-Owned Demo Queue

The demo implementation is local, synthetic work in one Node process. Enqueueing schedules a runner independently of subsequent HTTP reads or browser polling. Leaving the Jobs page, closing the tab, or opening another tab does not create another worker or stop an accepted job while that process remains alive. Query polling only observes the server state.

The runner allows at most two concurrent executions globally and one per owner. It admits at most 30 active jobs per owner, retains at most 100 jobs per owner and 1000 overall, and caps definitions at ten attempts per job. Thus the request-key map is bounded by the same jobs/attempts rather than silently evicting keys and risking duplicate work. Sample definitions allow three attempts. Job payloads are bounded to 16 KiB of serialized JSON and results to 64 KiB. A full retained history requires a demo reset; it is not automatically deleted. State is lost when the server process restarts and is not shared between instances.

`sample-report` processes twenty synthetic records and produces a local report/checksum. `sample-export` processes the same records and returns generated CSV content as a result value. Both handlers actually execute work in named preparation/processing/finalization stages with cancelable waits. Selecting **Fail The First Attempt** causes a deterministic failure after ten records on attempt one. An explicit retry starts a fresh attempt and completes. No email, notification, backend mutation, analytics event, or external request is performed by these sample handlers.

The Empty scenario hides directory records without deleting or stopping underlying work. Loading/Error scenarios remain owned by the shared DemoApiClient. Account reset aborts that owner's controllers, drops queued/history/idempotency records for that account, and leaves other owners intact. Global reset does the same for everyone. Record identity and controller identity are checked before progress/completion writes, preventing an old handler from restoring a removed job after reset. Handlers must await all child work and honor cancellation; the generic runner cannot undo side effects from uncooperative custom code.

Composition exports:

- `BackgroundJobService` from `services/backgroundJobService.ts`; construct it with the existing API client and register it as `backgroundJobService` in the client container.
- `handleDemoBackgroundJobRequest(request, path, userId, { empty })` from `server/handleDemoBackgroundJobRequest.ts`; register it before an optional handler that returns early.
- `resetDemoBackgroundJobs(userId?)` from `server/demoJobQueue.ts`; register `() => resetDemoBackgroundJobs()` globally and `resetDemoBackgroundJobs` for account reset.
- `handleLiveBackgroundJobRequest(request, path, forward, userId)` from `server/handleLiveBackgroundJobRequest.ts`; register it in the optional live-feature proxy.
- Query keys are module-owned in `jobsQueryKeys.ts` and rooted at `['jobs']`; future job events should invalidate that root or the matching detail key. Logout clears the shared query cache.

## Adding A Job Type

Create a separate input schema/model near the owning module. At trusted server composition time, call `registerBackgroundJobDefinition` from `server/jobDefinitionRegistry.ts` with its unique `type`, input schema, `retrySafe`, `maxAttempts`, and asynchronous `run(input, context)` handler. Do not register definitions from user input or send executable handler code through the API. Duplicate registrations are rejected. The samples use `getBackgroundJobDefinition` to remain safe across development module reloads.

The execution context supplies `jobId`, `userId`, attempt number, `AbortSignal`, `reportProgress`, and `wait`. Check/propagate the signal around work and pass it into cancellable I/O. `wait` removes its timer and abort listener on both completion and cancellation. Report bounded, nondecreasing progress; stage names can change while completion must not regress within an attempt. Each handler returns `{ summary, values }` validated by `BackgroundJobResultSchema`. Unknown exceptions become a safe generic failure; use `JobExecutionError` only with a catalog-backed, safe user-facing message and a deliberate retryability decision.

All authored stage names, labels, validation messages, and result labels belong in `src/strings.ts`. The UI maps known stage identifiers to that catalog. Add a catalog mapping for every module-owned stage and a display label for a module-owned job type before exposing it in the UI. The provided dialog deliberately offers only the harmless sample types; a domain workflow can call the same service with its registered type/payload.

Only mark a definition `retrySafe` when replaying the whole handler is safe. Any external effect must have its own durable idempotency token, commonly derived from job ID plus the logical effect, and preserve it across attempts. Attempt number alone is not an effect-deduplication key. The demo runner is useful for exercising a module; production definitions must also be implemented and authorized in the durable backend worker.

## Durable Live Backend Contract

The live adapter forwards Portal's `/portal/jobs` namespace to the authenticated backend `/jobs` namespace. It validates inputs and successful responses using the domain schemas and checks returned ownership. It does not start a Node timer, run the demo handlers, fall back to demo behavior, or claim work is durable on behalf of an unavailable backend.

| Portal API                                          | Backend API                        | Success                              |
| --------------------------------------------------- | ---------------------------------- | ------------------------------------ |
| `GET /portal/jobs?query=&status=&offset=0&limit=10` | `GET /jobs` with validated filters | `200 { data, total, offset, limit }` |
| `POST /portal/jobs`                                 | `POST /jobs`                       | `202 BackgroundJob`                  |
| `GET /portal/jobs/:id`                              | `GET /jobs/:id`                    | `200 BackgroundJob`                  |
| `POST /portal/jobs/:id/cancel`                      | `POST /jobs/:id/cancel`            | `200 BackgroundJob`                  |
| `POST /portal/jobs/:id/retry`                       | `POST /jobs/:id/retry`             | `202 BackgroundJob`                  |

Create body: `{ type, name, payload, idempotencyKey }`. Retry body: `{ expectedAttempt, idempotencyKey }`. Cancel has no body. List defaults to ten rows and is capped at fifty. Names are trimmed and limited to eighty characters; search is limited to two hundred. Job IDs and request keys are UUIDs. Models under `models/` are the precise camelCase JSON contracts, including nullable timestamps/result/failure and the attempt-history array. Responses must contain only the current user's records. Unknown/foreign IDs return the same `404`; use `400` for invalid input, `409` for state/idempotency/attempt conflicts, and `429` for capacity limits. Backend errors follow the existing backend error-envelope contract; successful responses must include JSON.

A production backend must atomically persist the job and owner-scoped idempotency reservation before acknowledging acceptance. Persist state transitions, progress, results, attempts, failures, and cancellation intent in shared durable storage. Workers require bounded concurrency, atomic leases/claims with expiry, heartbeats, fencing against stale workers, crash recovery, and a deliberate dead-letter/retry policy. Enforce the owner on every endpoint independently of the proxy. Authorize each type and payload server-side. Reject unknown types and oversized inputs/results, and apply per-owner admission limits.

Cancellation must be durable and cooperative; an acknowledged cancel must fence all late completion writes. If a production operation needs a separate cancel-requested state before a worker confirms cancellation, extend the model and UI contract explicitly rather than claiming the work has already stopped. Retried attempts need atomic compare-and-set against `expectedAttempt` and the same owner-scoped idempotency contract. External effects require an outbox or equivalent durable effect-deduplication mechanism. Define and communicate retention/expiry of job history and request keys together; never drop the idempotency protection while a duplicate operation can still be accepted.

The Next.js request process is an authenticated control-plane proxy. Its memory, timers, and process lifetime are not a production queue. This template includes no database, broker, backend deployment, durable worker, or production job credentials. Live integration is available only when the configured backend implements this contract; build/demo checks do not verify that infrastructure.
