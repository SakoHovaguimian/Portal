# Authentication and sessions

The browser submits email/password to `POST /api/auth/session` with `action: login` or `action: signup`. Effective demo runtime also accepts the validated `action: preset` account selection; live runtime rejects that action. The server validates input and calls Firebase Identity Toolkit REST. Signup also provisions the application user on the backend. Login obtains the authoritative application profile from `GET /users/profile`. A Firebase account alone is insufficient without its backend profile; provisioning failures must be resolved before that account can sign in.

Sign-in and signup reuse the server's input schemas for immediate field feedback. Invalid inputs display their own error and the first invalid input receives focus. Credential or service failures appear as form-level alerts. The auth screens link to the public privacy page.

The `portal_session` cookie contains a random 256-bit identifier. Portal hashes the identifier for the lookup key and stores the Firebase ID token, refresh token, and minimal user profile in a session record. `jose` encrypts the record using AES-256-GCM with a key derived from `SESSION_SECRET`. Cookie flags are HTTP-only, same-site lax, path `/`, and secure in production. Sessions expire 30 days after sign-in. Refresh and profile updates preserve that deadline and cookie identifier.

`AppSession` contains user display data and the ID token expiry only. Keep private session records and credentials out of React props, JSON responses, browser storage, logs, URLs, and analytics.

Live mode uses Node 22.13+ and SQLite on the Portal host. The default file is `.portal-data/sessions.sqlite` in the app directory. When deployments replace that directory, set `PORTAL_SESSION_DB_PATH` to an absolute file path on writable, persistent local storage. Select a private directory outside assets served by Next.js. Keep the same randomly generated `SESSION_SECRET` across restarts. Rotating it or losing the database signs users out. If restoring an older database backup, rotate the secret so the backup cannot restore previously revoked sessions. Deployments across multiple hosts or on ephemeral filesystems need a shared durable session store in place of the local SQLite implementation. Demo keeps its own in-memory database.

Users with legacy cookies containing encrypted Firebase credentials must sign in once after deploying opaque sessions.

## Refresh lifecycle

- Server layouts read session records. Sign-in and sign-out write cookies in Route Handlers.
- The backend proxy refreshes when five minutes or less remain and retries once after a backend `401`. A repeated backend `401` returns a recoverable `503` when Portal still has a valid session. The backend response can deny access without discarding Portal's login.
- In-process refresh requests coalesce per session. A short SQLite lease coordinates any workers using the same local database. Updates apply only to existing, unexpired rows, so a concurrent refresh cannot recreate a revoked session.
- Firebase's confirmed invalid or expired refresh token, disabled user, or missing user response revokes the record and returns `401`. Rate limits, unexpected provider errors, timeouts, and outages return `503` and preserve the record.
- `SessionKeepAlive` refreshes through the session route on visibility and every five minutes while visible.
- A Portal `401` returns the user to sign-in with an internal return path.

All mutation routes reject cross-origin browser requests. Set PORTAL_APP_ORIGIN to the public origin when an ingress changes the request origin. The forwarding proxy ignores incoming authorization headers, supplies the session token itself, encodes path segments, avoids following redirects, and forwards only selected headers. The backend must still enforce every business permission and protect auth endpoints from abuse.

Profile editing updates names, phone, and date of birth. Email is read-only because changing Firebase identity requires a separate verified flow. After profile updates, the session route reloads the trusted backend profile. Logout first attempts to remove this browser’s push registration. The logout handler revokes the current Portal session record before clearing its cookie, and the browser clears the query cache. Logout revokes the current browser session. Other devices retain their independent sessions. Push cleanup is best effort.

## Roles And Setup

Session roles are `user`, `admin`, or `superadmin`, mapped from the trusted application profile by the server-only `mapUserRoleTransport`. Canonical Portal lowercase roles are explicit; Hono `USER`/`ADMIN` map to `user`/`admin`. Organization roles (`OWNER`, `MANAGER`, `EMPLOYEE`, and `RECEPTIONIST`) and unknown or missing roles receive least-privilege `user`. Only the canonical Portal profile’s explicit lowercase `superadmin` grants that role; `ADMIN` never implies `superadmin`. Backend permissions and platform allowlists remain authoritative. The browser cannot select a live role. Demo account switching creates a fresh session for a seeded identity and clears the previous client's cache. Every demo session read resolves current role, names, and disabled/deleted state from the authoritative demo user. A global demo reset changes the generation, invalidating prior cookies without disrupting concurrent refreshes during normal use.

New demo signups start resumable setup. The server saves each validated Profile and Preferences step; Review marks completion only after previous steps exist. Preset sign-in returns only the public session and an `onboardingRequired` boolean. The same safe redirect allowlist preserves the intended destination through setup. Authenticated screens and API requests check completion, with an explicit recovery allowlist. Live setup is enabled only when its backend contract is configured; see [Demo Mode](DEMO_MODE.md#generic-setup).
