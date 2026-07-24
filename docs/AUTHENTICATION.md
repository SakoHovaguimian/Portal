# Authentication

`PORTAL_AUTH_MODE` supports `none`, `firebase`, and `custom`.

## No auth

This is the default so the template runs without credentials. Forms validate and redirect, but no account or session is stored. Do not mistake demo mode for authorization.

## Firebase

The Firebase adapter uses Identity Toolkit REST endpoints from server code. The browser receives only an encrypted, HTTP-only `portal_session` cookie.

Required variables:

- `PORTAL_AUTH_MODE=firebase`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGE_SENDER_ID`
- `FIREBASE_APP_ID`
- `SESSION_SECRET` with at least 32 characters

Before production, decide email verification, password policy, account linking, MFA, session revocation, disabled users, signup policy, deletion, and provider-side abuse controls.

## Custom

`custom` intentionally blocks portal access until an adapter is implemented. Replace the Firebase-specific composition in `src/container.ts` with a product-owned interface and implementation. Define:

- credential or OAuth entry points;
- callback and error behavior;
- minimal session payload;
- refresh, expiration, revocation, and logout;
- server-side authorization lookup;
- account creation and deletion;
- role/tenant claims and their source of truth.

## Security boundary

Layout redirects are user experience, not authorization. Verify access inside every data service, Route Handler, and mutation. Return only fields the caller may see.
