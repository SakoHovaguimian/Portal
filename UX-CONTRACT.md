# Portal UX contract

## Product context

English-language workspace for operators managing people, requests, and conversations. Dates display in the browser’s timezone using en-US formatting; date of birth is a date-only field serialized at UTC midnight. Accessibility target: WCAG 2.2 AA. Native profile date control intentionally accepts OS popup geometry and locale. DatePicker is available when the application owns a date-only calendar; its locale and optional owned labels are caller-configurable.

## Business-context sources

| Scope                   | Source                                                       | UI consequence                                                          |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Ownership and transport | [Backend contract](docs/BACKEND_CONTRACT.md)                 | Current-user requests/profile; backend remains authoritative            |
| Demo persistence        | [Demo guide](docs/DEMO_MODE.md)                              | Reloads preserve edits; process restart resets fixtures                 |
| Credentials and expiry  | [Auth guide](docs/AUTH.md)                                   | Masked passwords, public session only, expired sessions return to login |
| Consent and push        | [Analytics](docs/ANALYTICS.md), [realtime](docs/REALTIME.md) | Independent opt-ins, demo disables external effects                     |

## Visual contract

[DESIGN.md](DESIGN.md) records visual intent. Typed ThemeDefinition objects and their shared CSS adapter are canonical. Shared UI primitives, semantic token mapping, and presentation provider must be reused. Theme identity, light/dark mode, and motion settings survive navigation and reload; browser tabs synchronize preference changes. Selecting a theme loads its complete palette while preserving light/dark mode. Obsolete saved accent overrides are ignored. Selection fill and hover opacity follow the active theme. See [loadable themes](docs/THEMING.md).

## Canonical UI Map

| Capability          | Canonical owner                                                                         | Source of truth                          | Allowed variants                                                    | Verification                                                 |
| ------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Select/Listbox      | Select/MultiSelect in src/components/ui                                                 | DESIGN + this contract                   | authored popup, country/timezone options, compact segmented choices | keyboard, popup width/collision, modal Escape                |
| Table Selection     | DataTable.selection + BulkActionBar                                                     | UI system + domain query/permissions     | page keys; explicit caller-owned all-results scope                  | mixed header, disabled rows, mobile, partial failure         |
| Combobox            | Combobox in src/components/ui                                                           | UI system                                | local filtering / caller-owned remote search                        | keyboard, clear, IME-safe debounce, loading/error/retry      |
| Upload              | UploadField + FileList                                                                  | UI system + media domain validation      | local selection / caller-owned transfer                             | type/size/count, progress, cancel/retry                      |
| Stepper             | src/components/ui/components/Stepper.tsx                                                | UI system                                | horizontal (default), vertical, responsive                          | narrow/desktop, disabled, aria-current                       |
| Values And Progress | Slider/RangeSlider, NumberStepper, ProgressBar/ProgressRing, Meter in src/components/ui | [Value controls](docs/VALUE_CONTROLS.md) | single/range, icons, vertical, reverse fill, measured/indeterminate | keyboard, limits, disabled/read-only/invalid, reduced motion |
| Date                | DatePicker and Field/Input in src/components/ui                                         | This contract                            | authored date-only; native date-of-birth                            | keyboard/browser                                             |
| Form                | Field/Input and module Zod schemas                                                      | This contract                            | create/edit/read-only                                               | browser success/failure                                      |
| Scrollbar           | src/app/globals.css                                                                     | DESIGN.md                                | document/table/chat                                                 | computed style and narrow viewport                           |
| Toast               | src/presentation/PresentationProvider.tsx                                               | This contract                            | success/info/warning/error                                          | live region and demo alert                                   |
| CRUD                | Domain services and shared query hooks                                                  | Backend contract                         | create/edit/delete                                                  | manual full flow                                             |

## Workflow outcomes

- Login/signup opens the allowed internal return path, default dashboard. Invalid credentials keep entries and show an error.
- Create request clears the field only on success and refreshes the list/counts. Edit stays on detail with a success toast. Delete confirms through the shared dialog, disables duplicate actions, and returns to the list after success.
- Profile save keeps entries on failure and updates the public session after success. Email is read-only pending a dedicated identity flow.
- Chat places outgoing messages immediately in an in-memory outbox and clears the composer for the next message. Pending/failed items retain text, attachments, reply scope, and an idempotent retry key. Server responses reconcile without duplicate rows; failed work remains retryable. Reactions and reversible message actions project immediately and serialize per message with rollback on failure. Socket/push events refresh authoritative queries. Shift+Enter sends outside IME composition; Enter inserts a newline.
- Notifications require an explicit click before requesting permission. Denied/unsupported/unconfigured/demo states explain availability. Sign-out revokes browser push and clears query data.
- Consent choices have equally reachable actions and remain editable in Appearance. Changing consent never grants notification permission.

## State and navigation

Lists use server paging contracts (default 25), URL query filters, and stable domain query keys. Empty, loading, and failure states are visible; failure offers retry. Profile forms load only after their query succeeds. Protected routes independently require a session on the server and API. Route metadata uses the single `src/strings.ts` catalog.

Tables preserve horizontal access on narrow screens. Mobile navigation opens a full-screen modal with the same links and account controls, safe areas, Escape, focus trap, and restoration. Desktop uses the fixed sidebar. Screens own their PageHeader h1. The library uses a searchable catalog with category filters and one focused preview; preview/category choices use URL history and visited examples preserve local state. Local catalog search is transient discovery state. Query and mutation errors preserve safe input. Do not persist passwords/tokens or private form drafts in browser storage.

## Forms, overlays, and feedback

Use noValidate and schema-based messages. Associate labels with their input, surface errors in an alert, and prevent duplicate submissions. Passwords are masked and use password-manager autocomplete. Native date input is permitted for profile date of birth. Shared date/time/datetime-local schedule fields intentionally accept OS popup geometry and language. Authored Select/MultiSelect use matching trigger/popup borders, corners, width, bounded scrolling, typeahead, and keyboard selection. Textareas auto-grow within their layout and may opt into a fixed footprint. ColorInput keeps incomplete HEX drafts local and exposes copy success/failure. MultiSelect can enforce a maximum selection count without preventing deselection.

Destructive actions use the shared modal, focus the safe action first, and restore focus on cancellation. Long content scrolls inside the viewport. Shared toasts supplement inline errors; critical errors must not exist only in a transient toast. New toasts sit nearest their selected edge, with older items moving inward and closing gaps after exit. Arrival and layout motion use independent elements, so repeated notifications can interrupt movement without resetting their content or focus. Hover or keyboard focus pauses expiration. Toasts remain within viewport/safe-area bounds; overflowing stacks scroll.

Modal, alert, sheet, navigation-menu, and toast motion defaults belong to the active theme’s individual overlay profiles. Saved browser overrides and local preview overrides are optional; reset restores the active theme. Exit completion and its fallback use the resolved exit duration. Reduced motion wins over every profile/override and suppresses both CSS and JavaScript movement. Bottom-sheet handles follow pointer travel and either settle or dismiss; click/Enter/Space, Close, and Escape provide non-drag dismissal. Popover direction/origin follows the actual trigger placement after collision resolution.

## Reusable state and drafts

Segmented choices use native radio semantics; more than two choices become the shared Select below 600px. SegmentedPanels preserves mounted drafts and marks inactive content hidden/inert. Stepper progression and eligibility remain caller-owned; changing orientation never changes state. Reordering offers pointer handles plus keyboard and up/down alternatives. Saved reduced motion and device preferences suppress movement in CSS and JavaScript.

The Portal baseline selection fills use 7% action color in light mode and 12% in dark mode; hover uses 5%/8%. Other presets own their state opacity through the same roles. Focus remains separately visible. Every palette uses its theme-owned action color as its tint source. Busy buttons preserve layout and accessible names.

The shell uses the shared navigation guard. Forms register dirty/busy refs through useUnsavedFormGuard. Clean links preserve Next Link and modifier clicks; dirty in-app links and same-document Back/Forward require the shared discard dialog. A canceled traversal returns to the original existing entry; an accepted traversal replays it. History tracking preserves Next state and never inserts sentinel entries or blocks a deliberate cross-document exit. Actual document unloads use the browser lifecycle guard.

Committed navigable tabs, filters, sort, and pages create URL history entries; Back/Forward restores them. Use `useUrlState` or `useDirectoryState` with controlled screen state. Replacements are reserved for normalization and explicitly transient state. Application Back actions use `useGuardedBack(owningRoute)` and fall back to that route on direct entry instead of relying on history length.

Accordion keeps focus on its trigger and supports one or several expanded panels. Ratings use radio semantics; save/reaction controls expose pressed/busy state and remain caller-owned. Native carousels are focusable, visibly scrollable, and touch-operable. Reordering restores keyboard focus to the moved handle. Refresh failures may preserve mounted content through QueryBoundary's optional retainDataOnError; authentication/ownership/not-found failures replace stale content. The component library and optional assistants do not send backend writes or microphone permission requests automatically.

Sliders retain standard arrow/Home/End/Page key behavior and 44px targets. Range thumbs cannot cross; each has its own accessible name and form value. End-origin fill changes paint only. NumberStepper accepts exact text input, clamps on commit, supports arrow keys and button presses, and disables increment/decrement at bounds. Native inputs receive invalid state and associated help/error text. Progress indicators distinguish measured and unknown work; meters describe measurements. Loading skeletons are decorative inside a labeled busy region. The owning workflow supplies cancellation/retry and never relies on color alone to explain a failure. All motion honors saved and device preferences.

## Verification policy

Do not write tests. Run static checks, a demo build, and manual browser/HTTP workflows. Record evidence and external integration limits in [docs/VERIFICATION.md](docs/VERIFICATION.md). The static design audit is supplementary and does not establish complete accessibility or production integration correctness.

## Added Component Contracts

AvatarGroup overflow is discoverable by keyboard and touch through its people popover. File selection never implies a network upload; domain code owns transfer, validation, and cancellation. Table page selection never silently expands to matching results, and callers invalidate selection when the query scope changes. Bulk mutation results retain recoverable failures. Combobox commits IDs rather than arbitrary typed text; remote owners cancel or ignore stale responses. Date ranges have inclusive ordered date-only endpoints and emit null when cleared. Switch selection pulses share the theme-owned checkbox/radio motion and are disabled by either reduced-motion setting.

## Workspace And Theme Refinements

Protected pages share the full-width outer container. Only the chat workspace bounds its content to the remaining dynamic viewport; other screens keep document scrolling. Conversation details use a wide modal variant and structured sections. Avatar, overflow-avatar, switch-track, and switch-thumb corners are theme-owned; presence dots retain functional circles. Blueprint uses sharp geometry and Cupertino explicitly retains familiar circular/pill controls. Overlay Duration in the Motion specimen uses the shared Slider. Active demo response simulations are visible in the shell with a non-destructive action to restore normal responses for that browser.
