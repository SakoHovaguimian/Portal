# Backend integration contract

`PORTAL_API_URL` is the server-only API base URL, including any prefix (for example `http://localhost:3000/api`). Browser paths are relative to `/api/backend`. The proxy adds `Authorization: Bearer <Firebase ID token>` and `app-version: <APP_VERSION>`. Requests/responses are uncached. Only a fixed set of request/response headers is forwarded. Incoming browser bearer/cookie/host headers are never copied upstream.

Portal preserves its existing snake_case user/feature/dashboard transports and maps them to camelCase domain models in [domainMappers](../src/services/api/domainMappers.ts). Transport definitions live in independent files under [models](../src/services/api/models/). They are maintained source, not generated OpenAPI output.

| Method and path relative to API base                   | Contract                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| GET `/users/profile`                                   | Authenticated application user, including application ID and Firebase `external_id`                 |
| POST `/users`                                          | Provision application user after Firebase signup; accepts first_name, last_name, email, external_id |
| GET `/users?query=&limit=25&offset=0`                  | Page of UserTransport                                                                               |
| GET `/users/:id`                                       | UserTransport                                                                                       |
| PUT `/users/:id`                                       | Current user profile mutation; backend derives owner from token                                     |
| GET `/feature-requests?query=&limit=25&offset=0`       | Page of the current user's FeatureRequestTransport                                                  |
| GET `/feature-requests/:id`                            | Current user's FeatureRequestTransport                                                              |
| POST `/feature-requests`                               | `{ message }`; owner derived from token                                                             |
| PATCH `/feature-requests/:id`                          | `{ message }`; enforce ownership                                                                    |
| DELETE `/feature-requests/:id`                         | Enforce ownership; 204 on success                                                                   |
| GET `/dashboard/overview`                              | DashboardOverviewTransport                                                                          |
| GET `/dashboard/models`                                | `{ models: DashboardModelSummaryTransport[] }`                                                      |
| GET `/dashboard/models/:key`                           | DashboardModelMetaTransport                                                                         |
| GET `/dashboard/records?model=&search=&limit=&offset=` | Page of records authorized for the current user                                                     |
| GET `/chat/messages`                                   | Up to the latest 100 ChatMessage objects, oldest first                                              |
| POST `/chat/messages`                                  | `{ message }`; returns server-authored ChatMessage                                                  |
| POST `/realtime/tickets`                               | `{ ticket, expires_at }`, single use, short expiry                                                  |
| POST `/devices/`                                       | `{ device_token, device_type: "Web" }`                                                              |
| DELETE `/devices/`                                     | `{ device_token }`; unregister only the current user's device                                       |

Core starter pages use `{ data, total, limit, offset }`. Optional inbox and account-tool adapters retain their canonical `{ data, page: { limit, offset, hasMore, nextOffset } }` response. Domain schemas enforce the required fields after mapping. Error responses use `{ message }` and a meaningful HTTP status. No token, stack trace, or private upstream payload should appear in errors.

## Optional Module Contracts

Choose capabilities in `src/config/portalModules.ts` and implement their backend endpoints before using them live. Disabled capabilities return 404 at their route/API boundary; missing live integrations return an error without fixture fallback.

- **Publishing, public images, and engagement:** [Publishing](BLOG.md) owns exact block, revision, upload, visibility, and account-action contracts. Public reads cannot reveal drafts. Staff uploads use the authenticated multipart proxy and force public IMAGE visibility.
- **Notifications:** `/portal/notification-inbox/*` maps to `/notifications`, `/notifications/counts`, `/notifications/preferences`, per-record and bulk read/archive, and `/user-settings` timezone/detection endpoints. Lists, counts, and mutations are account-scoped. Unpublished, expired, archived, and in-app-disabled records stay out of the inbox. Opening a destination does not mark it read. Models define strict category/channel filters and selected/all/filtered bulk scopes across pages.
- **Account tools:** `/portal/account-tools/*` maps to the current account, registered devices, `/system/faq`, and `/system/legal-information`. `GET /devices` returns the account's device array; the adapter verifies ownership, filters/pages it, and strips device tokens. Removal unregisters push only. Account deletion verifies the typed current email and calls canonical deletion, then clears the web session; it does not promise storage erasure. Demo legal and FAQ content is illustrative.
- **Delivery diagnostics:** `/admin/account-tools/deliveries` maps to `/notification-deliveries` and per-delivery `/attempts`. Views inspect outcomes and cannot send or retry notifications. The web platform role is required; the backend independently enforces its operator allowlist. Hono ADMIN does not establish platform access: an integration needs an explicit trusted Portal capability/role.
- **Onboarding:** opt into `PORTAL_ONBOARDING_ENABLED=true` only with `GET/PATCH /onboarding`. Models under `modules/onboarding/models` define progress and ordered profile/preferences/review updates. The API persists and validates completion; client and proxy gates honor it. Setup, the current profile, account tools, sign-out, and allowed developer recovery remain reachable.

Every module implements equivalent validation, authorization, paging, mutation behavior, and cancellation in demo mode. Register global and per-account cleanup with `demoResetRegistry`; response simulation never corrupts records or contacts live providers.

Socket/push event contracts are in [REALTIME.md](REALTIME.md). This is a template integration boundary; the exact JobLens construction-project and Obelisk business endpoints differ. Adapt the domain services and matching demo handlers together when targeting those APIs. Do not silently call an endpoint that only resembles the contract.

## Conversation Chat And Background Jobs

The original `/chat/messages` endpoint remains a compatibility shared log. The richer UI uses conversation-scoped endpoints and private attachments documented in [CHAT.md](CHAT.md). Live adapters validate mutation shape and file signatures, but the backend must enforce membership, message ownership, roles, bounded storage, attachment authorization, and idempotency on every request.

The browser jobs facade `/portal/jobs` maps to backend `/jobs`, including owner-scoped listing/detail and cancel/retry actions. See [BACKGROUND_JOBS.md](BACKGROUND_JOBS.md) for states, attempts, progress, request keys, cancellation, durable-worker requirements, and explicit retry semantics. The local server demo runner is process-local; live mode requires the backend's durable queue. No live failure substitutes fixtures. Disabled project capabilities are blocked at page and proxy boundaries, including the raw `/jobs` alias.
