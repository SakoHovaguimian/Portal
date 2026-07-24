# Backend and data

Portal separates server and browser data access.

- `ApiClient` runs server-side and calls `PORTAL_API_URL`.
- `/api/backend/[...path]` verifies the session, checks mutation origin, and proxies to the upstream API.
- `BrowserApiClient` calls only the same-origin proxy.
- TanStack Query supplies client caching, retries, and invalidation.

## Before connecting an API

Define the API error envelope, version header, timeout and retry policy, idempotency, pagination, filtering, uploads, rate limits, authorization, and audit events.

Validate untrusted payloads at system boundaries. Keep transport DTOs separate from view models when their lifecycle or visibility differs.

## Persistence decision

Choose one source of truth:

- none/static;
- browser-local preferences only;
- relational database;
- document database;
- existing upstream system.

Document migrations, backups, restore verification, deletion, retention, environment isolation, seed data, and ownership before writing durable records.
