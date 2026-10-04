# Query hook families

TanStack Query owns server state. Hooks call domain services from `useServiceContainer`; they never instantiate API clients or call fetch directly for domain data.

Use stable keys from `src/queries/queryKeys.ts` or a module-owned key file. Include every request filter/page/identity that changes results. Keep committed query/model state in the URL. Use a bounded stale time and default retries from the shared QueryClient. Pass AbortSignal through services for cancelable requests.

Mutations validate input, block duplicate submits, retain form input on failure, and invalidate both the list/detail and affected dashboard summaries. Ownership is derived by the API, never a mutable browser field. Logout clears all query data. Realtime events invalidate the same keys used by regular reads.

Render loading, inline failure/retry, empty/no-results, and success. Add matching demo data and mutation behavior. Run `npm run check`, demo build, and manual flows; do not write tests.
