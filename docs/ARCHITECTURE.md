# Architecture

Portal is one npm application. There are no workspace packages, generated API SDK, controller layers, or repositories. Module-owned server adapters translate only the explicit contracts that differ from the browser facade.

```text
src/app                   route composition, layouts, auth handlers, backend proxy
src/modules/<domain>      screens, hooks, domain services, domain-specific models
src/services              API, auth, session, demo, realtime, notifications, analytics, privacy
src/models                shared, independent domain schemas and types
src/clientContainer.ts    browser service construction
src/container.ts          server service construction and demo/live selection
src/components/ui         shared components and shell
src/presentation          canonical toast, alert, sheet service
src/strings.ts            all authored display copy
```

## Browser data flow

Screen → query/mutation hook → domain service → `BrowserApiClient` → `/api/backend/*` → session verification/refresh → live API or `DemoApiClient`.

Domain services validate mutation inputs, encode paths/query parameters, and map transport data to domain models. The proxy supplies authentication; browser-supplied ownership or authorization headers are never forwarded. The real backend remains authoritative for permissions. The demo API enforces current-user ownership itself.

The browser calls Firebase only for opt-in Messaging. It never receives access/refresh tokens or calls Firebase Authentication. Client code imports public session models, never server containers or environment.

## Server composition

Root layout passes only a public runtime configuration to `RuntimeProvider`. Protected layouts read the encrypted cookie and pass a token-free `AppSession` to `AppProviders`. They never write cookies. Query loading occurs through the browser proxy, which can safely refresh cookies in a Route Handler. `proxy.ts` provides navigation gating; API routes independently verify sessions.

`getContainer()` caches separate live/demo services and selects them from the effective request runtime. The HTTP-only developer preference cookie can override `DEMO_MODE` only on an allowed development/demo server; production live ignores it. Auth, session decoding, root runtime configuration, public article reads, and proxying use that same decision. Mode changes clear the previous session. No client build flag selects mock behavior.

`projectConfiguration.ts` owns project defaults, starter data, capability flags, brand asset paths, and navigation order. The initializer writes it together with the bounded identity block in `strings.ts`, npm metadata, and a server-only environment. `portalModules.ts` exposes those capability flags. The shell composes role-aware destinations; route/module boundaries and `moduleAvailability` independently reject disabled capabilities. `featureBackendProxy` composes server adapters with a refresh-aware, credential-owning forwarder. `demoModuleHandlers` composes equivalent demo operations; `DemoApiClient` applies request simulation once. New modules register global and per-account reset callbacks with `demoResetRegistry`. No live failure falls back to fixtures.

Public publishing uses its server-only published reader and a small optional account-actions boundary. It never mounts the protected authentication/realtime shell or refreshes anonymous sessions. Staff public-image uploads and generic engagement are independent capabilities; engagement target resolvers may register more public content types without changing ownership rules. See [publishing](BLOG.md), [backend contracts](BACKEND_CONTRACT.md), and [demo mode](DEMO_MODE.md).

## State ownership

- TanStack Query: server data, request status, cache and mutation invalidation.
- URL: committed filters, selected dashboard model, list query.
- Component state: forms, disclosure, pending UI.
- Zustand: existing dashboard density/chrome only; do not duplicate server data there.
- Local storage: appearance and motion, consent choice, per-user push opt-in and FCM registration identifier. Never auth tokens.
- Server process: demo records and demo credentials. Live data lives on the backend.

The custom UI system in `src/components/ui` includes the reusable LeafLaunch foundation. Typed theme objects in `src/themes` are canonical; a shared compiler feeds ThemeScript, the provider, semantic CSS registrations, and scoped previews. See [loadable themes](THEMING.md). Preference services are constructed in the client container, and shared providers own appearance/motion/navigation/assistant presentation. Components receive callbacks; server data stays in domain services and query hooks. See [UI system](UI_SYSTEM.md) and [migration decisions](MIGRATION.md).

## Chat and background work

Conversation-scoped chat and background jobs use module-owned server adapters composed in `featureBackendProxy` and `demoModuleHandlers`. Chat enforces membership and message ownership; job records are account-owned. The demo job runner executes on the server with bounded concurrency and cancellation; it continues independently of browser polling. Its records and chat attachments are process-local. Live chat storage, private media, and durable job execution belong to the backend, never browser state or a hidden demo fallback. See [chat](CHAT.md) and [background jobs](BACKGROUND_JOBS.md).
