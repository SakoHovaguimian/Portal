# Architecture

Portal uses Next.js 16 App Router and React 19.

## Layers

- `src/app` — routes, layouts, metadata, loading/error boundaries, Route Handlers
- `src/modules` — product surfaces grouped by capability
- `src/components` — reusable UI primitives
- `src/models` — focused model files
- `src/services` — transport, auth, sessions, realtime
- `src/config` — server-only environment access
- `src/content` — application-owned strings
- `src/theme` — source and generated semantic theme

Server Components are the default. Add client boundaries only for browser state, event handlers, or client libraries.

Authentication redirects in layouts improve navigation but do not secure data. Authorization belongs in a data access layer or service close to each read and mutation.

Example data is deliberately isolated in `src/modules/portal/data/portalDemoData.ts` so it can be removed without touching infrastructure.
