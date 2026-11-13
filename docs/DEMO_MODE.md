# Demo Mode

Set `DEMO_MODE=true` in `.env.local`, or run `DEMO_MODE=true npm run dev`. Restart after changing the environment flag. False/unset selects the live integration; failures never silently switch modes.

## Runtime And Developer Controls

`getEffectiveRuntime()` combines the server environment with the validated `portal_demo_preferences` cookie. The cookie is HTTP-only, same-site lax, secure in production, and available only in development or when the server explicitly enables demo mode. Production live deployments ignore this cookie and return 404 for every `/api/dev-settings/*` endpoint and the settings page. The browser receives only public runtime configuration.

`/dev-settings` controls runtime, the request scenario, and latency from 0 to 5000 milliseconds. The Populated scenario reads stored records. Loading adds a finite 2500–5000 millisecond delay; Error returns 503. Empty returns empty list pages and counts without removing records. Returning to Populated restores the same data. Onboarding and developer recovery remain reachable during simulation failures. Changing runtime clears the session, and the client clears cached data before returning to sign-in.

All developer mutations enforce same-origin browser requests. Reset and account switching also require an authenticated demo session. `POST /api/dev-settings/demo` enables local demo mode from sign-in only when developer controls are available. No environment or cookie can enable it on a production live deployment.

## Accounts And Signup

All seeded accounts use `password123`. The sign-in screen offers these presets:

| Preset         | Email                    | Behavior                                                                                         |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| New User       | `new@example.com`        | Completed setup and no private records                                                           |
| Populated User | `sako@example.com`       | Independently owned sample requests and activity                                                 |
| Onboarding     | `onboarding@example.com` | Restarts only this account's setup and registered private demo records when selected as a preset |
| Admin          | `admin@example.com`      | Workspace content and operational access                                                         |
| SuperAdmin     | `superadmin@example.com` | Account and platform administration                                                              |

The existing `ada@example.com` and `mina@example.com` sample accounts remain available. Signing in by email resumes existing progress, including for the onboarding account; choosing the Onboarding preset explicitly restarts it. Signup creates a user-role account with an incomplete setup and no private records. Duplicate email, password validation, disabled accounts, and deleted accounts are enforced server-side.

Feature requests are owned by the authenticated user. The workspace directory and chat remain shared. Staff roles do not grant access to another user's private requests, notifications, or account records. Current demo role and disabled/deleted state come from server state on every session read rather than stale cookie claims.

## Persistence And Reset

`getDemoState()` keeps users, requests, password hashes, and refresh sessions in this server process. Other modules own their own demo state. Reloads preserve changes; process restarts restore fixtures. Multiple server processes do not share state. Use only synthetic personal information.

`POST /api/dev-settings/reset` runs the reset registry, removes signup-created accounts, restores seeded credentials and module fixtures, resets simulation, and replaces the current session with a seeded preset. A trusted demo generation in the encrypted session invalidates all older demo sessions. `registerDemoReset(key, reset)` adds module reset behavior. `registerDemoAccountReset(key, resetUser)` clears only one account's records for a repeatable onboarding preset or account cleanup. Root server composition registers the enabled modules. Seed fixtures can use `populatedDemoUsers` from `demoPresets.ts`; it excludes New User and Onboarding.

## Generic Setup

`src/modules/onboarding` owns the configurable step descriptors, independent schemas, query hooks, service, recovery allowlist, and server-persisted demo progress. The default flow is Profile → Preferences → Review. Each saved step validates before advancing; reloads resume the current saved step. Completion is checked independently in the UI gate and authenticated API boundary. Recovery routes include setup, developer controls, profile, and account settings. The final destination uses the same internal redirect allowlist as sign-in.

Demo mode enables setup by default. Live setup is opt-in with `PORTAL_ONBOARDING_ENABLED=true` and requires the backend `/onboarding` GET/PATCH contract used by `OnboardingService`. The project-owned module configuration can disable onboarding entirely. Do not enable a live capability before its backend contract exists.

## External Effects

Firebase authentication REST is replaced with `DemoFirebaseAuthService`. Realtime sockets, Firebase Messaging, and Amplitude are disabled. Requests still pass through the authenticated Next.js backend proxy. Chat uses local server records and polling, and local alert simulation exercises presentation without sending a notification. Push controls save a separate per-user simulated opt-in without requesting browser permission; the choice survives sign-out.

Demo sessions record their mode. Switching to live invalidates them. A demo-only secret is allowed only for a demo-selected session; live sessions require a valid `SESSION_SECRET`. Tokens stay in encrypted HTTP-only cookies and never reach React.

## Extending The Demo

Add independent models in separate files and all authored copy in `src/strings.ts`. Declare `demo.handle`, `demo.reset`, and `demo.resetAccount` in the feature's module declaration, then import it into `src/config/portalModuleRegistry.ts`. Shared composition registers the enabled handlers and resets. See [adding and removing features](MODULES.md). The context includes the authenticated current user, parsed path, validated input helper, paging helper, the `empty` simulation flag, and serializable project routing. Return `null` for unmatched routes. Each handler must enforce its own role and ownership rules, validate mutations, support cancellation on reads, and preserve the live response and error contracts. Register both global and per-account reset behavior where the module owns private data.
