# Portal UX contract

## Product context

English-language workspace for operators managing people, requests, and conversations. Dates display in the browser’s timezone using en-US formatting; date of birth is a date-only field serialized at UTC midnight. Accessibility target: WCAG 2.2 AA. Native profile date control intentionally accepts OS popup geometry and locale.

## Business-context sources

| Scope | Source | UI consequence |
| --- | --- | --- |
| Ownership and transport | [Backend contract](docs/BACKEND_CONTRACT.md) | Current-user requests/profile; backend remains authoritative |
| Demo persistence | [Demo guide](docs/DEMO_MODE.md) | Reloads preserve edits; process restart resets fixtures |
| Credentials and expiry | [Auth guide](docs/AUTH.md) | Masked passwords, public session only, expired sessions return to login |
| Consent and push | [Analytics](docs/ANALYTICS.md), [realtime](docs/REALTIME.md) | Independent opt-ins, demo disables external effects |

## Visual contract

[DESIGN.md](DESIGN.md) records visual intent. Existing CSS is canonical. Shared UI primitives, semantic token mapping, and presentation provider must be reused. Light/dark and accent settings survive navigation.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Date | Field/Input in src/components/ui/components/Input.tsx | This contract | native date-of-birth | keyboard/browser |
| Form | Field/Input and module Zod schemas | This contract | create/edit/read-only | browser success/failure |
| Scrollbar | src/app/globals.css | DESIGN.md | document/table/chat | computed style and narrow viewport |
| Toast | src/presentation/PresentationProvider.tsx | This contract | success/info/warning/error | live region and demo alert |
| CRUD | Domain services and shared query hooks | Backend contract | create/edit/delete | manual full flow |

## Workflow outcomes

- Login/signup opens the allowed internal return path, default dashboard. Invalid credentials keep entries and show an error.
- Create request clears the field only on success and refreshes the list/counts. Edit stays on detail with a success toast. Delete confirms through the shared dialog, disables duplicate actions, and returns to the list after success.
- Profile save keeps entries on failure and updates the public session after success. Email is read-only pending a dedicated identity flow.
- Chat retains unsent text after failure, clears after successful API creation, and refreshes from the authoritative query. Socket/push events invalidate that query; they do not become a separate state store.
- Notifications require an explicit click before requesting permission. Denied/unsupported/unconfigured/demo states explain availability. Sign-out revokes browser push and clears query data.
- Consent choices have equally reachable actions and remain editable in Appearance. Changing consent never grants notification permission.

## State and navigation

Lists use server paging contracts (default 25), URL query filters, and stable domain query keys. Empty, loading, and failure states are visible; failure offers retry. Profile forms load only after their query succeeds. Protected routes independently require a session on the server and API. Route metadata uses the single `src/strings.ts` catalog.

Tables preserve horizontal access on narrow screens. Navigation remains reachable before main content on mobile. Query and mutation errors preserve safe input. Do not persist passwords/tokens or private form drafts in browser storage.

## Forms, overlays, and feedback

Use noValidate and schema-based messages. Associate labels with their input, surface errors in an alert, and prevent duplicate submissions. Passwords are masked and use password-manager autocomplete. Native date input is permitted for profile date of birth. Textareas do not resize outside their layout.

Destructive actions use the shared modal, focus the safe action first, and restore focus on cancellation. Long content scrolls inside the viewport. Shared toasts supplement inline errors; critical errors must not exist only in a transient toast.

## Verification policy

Do not write tests. Run static checks, a demo build, and manual browser/HTTP workflows. Record evidence and external integration limits in [docs/VERIFICATION.md](docs/VERIFICATION.md). The static design audit is supplementary and does not establish complete accessibility or production integration correctness.
