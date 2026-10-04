# Demo mode

Set `DEMO_MODE=true` in `.env.local`, or run `DEMO_MODE=true npm run dev`. Restart after changing it. The flag is read only on the server and the public runtime configuration reflects that decision. False/unset selects live mode; an unavailable live service never falls back to mock data.

## Behavior

- Firebase REST is replaced with `DemoFirebaseAuthService`, including signup, password checking, and refresh.
- All domain requests still go through `/api/backend/*`, where `DemoApiClient` handles them.
- `getDemoState()` stores one process-local copy of users, feature requests, chat messages, credential hashes, and refresh sessions. Browser reloads see mutations. A process restart resets them. Multiple server processes do not share demo state; do not use it as production persistence.
- Seed accounts are `sako@example.com`, `ada@example.com`, and `mina@example.com`, all with `password123`. Signup creates a new demo account.
- Feature requests belong to the authenticated user. Cross-account reads and mutations are denied. Profile mutation is self-only. The demo directory and workspace chat are shared.
- Dashboard counts are computed from current records. The existing example analytics charts are visible only in demo mode and labeled as sample data.
- Realtime transport and FCM are disabled. Chat uses local API state and polling; the simulate-alert button exercises the shared toast path. Browser notification controls describe simulation.
- Amplitude is never imported or initialized. Consent controls describe the disabled integration.

Demo cookies include the mode so switching to live invalidates demo sessions. A known demo-only session secret is allowed when no secret is configured; live mode requires a real secret. Demo data is deliberately disposable and must not contain real personal information.

## Extending the demo

Add domain models and copy in separate files. Implement the same route, query parsing, validation, ownership, response shape, mutation behavior, and error status that the live backend exposes. Update dependent counts/caches. Do not add client-only fixture arrays for business data or a second demo flag.
