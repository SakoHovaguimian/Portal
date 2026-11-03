# Migration verification

## Portal Standards Migration — November 3, 2026

Completed every module and shared-file gate using four Luna Max workers, exactly three modules per worker, with one module active per worker and coordinator acceptance before advancing. The coordinator handled the remaining two modules and all shared files. The durable contract is [Portal Code Standards](PORTAL_STANDARDS.md), linked from AGENTS and all module/service/query authoring guides. The one-off migration prompt and temporary rollout ledger have been removed.

ESLint now owns all maintained JavaScript/TypeScript formatting with no rollout exclusions. Six small AST rules cover expanded-block boundaries, constructors, service MARKs, interfaces, named callback returns and Zod enums; existing Next/copy/color/shared-control/Tailwind checks remain active. Prettier owns compatible non-code files only. Model moves retain schemas with their inferred/derived inputs and narrow compatibility exports. JSX uses hook-free local section/row helpers while preserving state owners, hook dependencies, keys, DOM and semantic styles. No dependencies, product copy, API contracts or CSS values changed.

- `npm run format` passed twice; SHA-256 comparison of 997 maintained files showed **zero changes on the second pass** (generated `next-env.d.ts` excluded).
- `npm run check` passed after final source formatting: zero-warning ESLint, route generation/TypeScript, Next editor diagnostics, strings/title case, semantic colors, shared controls and canonical Tailwind classes.
- `DEMO_MODE=true npm run build` passed: successful optimized compilation, TypeScript and 31 generated static pages. `git diff --check` passed.
- Full diff/model/caller review and a supplemental source audit found no hook-owner/dependency-array or await-count changes across the original 678 source files and 920 final source files. Embedded theme/worker scripts are structurally equivalent after whitespace/control-flow-brace normalization. Canonical enum reuse and shared identical action helpers explain removed duplicate literals; these checks supplement manual review rather than prove behavioral equivalence.
- Production ran on port 3002 because a separate development server occupied 3001. Browser demo sign-in reached the complete catalog. HTTP verified protected page rendering, directories/dashboard/notifications/onboarding/devices, anonymous 401, restricted staff 403, foreign-origin mutation 403, invalid input 400, synthetic feature create201/update200/read200/delete204, other-owner404 and deleted404, public publishing page200 and authenticated public-data200, unknown page404, and an empty demo Messaging worker200. The synthetic record was removed. An initial devices request used an incorrect path and returned404; the canonical `/portal/account-tools/devices` returned200. Anonymous access to the authenticated proxy returns401; public pages use their existing server read path.
- Desktop/narrow browser coverage includes state/error/retry/empty/success, validation focus, retained drafts, local mutations, overlays, navigation, keyboard controls, themes and 390px layouts; details follow. Production screenshot: `/tmp/portal-standards-production.jpg`.

Known limits: auth failure focus and the native Browser Back/tool path were reproduced in original implementations and preserved, as detailed below. App Back and link guards passed. Live Firebase/backend refresh, sockets, push, assistant generation and analytics were not exercised. No native notification/microphone permissions or external writes were triggered. The supplemental Premium strict text audit was interrupted after several minutes without a result; its stack was in HTML/regex scanning, so it is **not a passing audit**. Project-owned checks and manual gates passed. No tests, Xcode builds or worktrees were created. The owned production process and temporary viewport override were cleaned up; the separate development server was left running.

| Owner       | Module                | State    |
| ----------- | --------------------- | -------- |
| Luna A      | feature-requests      | Accepted |
| Luna A      | users                 | Accepted |
| Luna A      | chat                  | Accepted |
| Luna B      | blog                  | Accepted |
| Luna B      | engagement            | Accepted |
| Luna B      | account-tools         | Accepted |
| Luna C      | notification-inbox    | Accepted |
| Luna C      | onboarding            | Accepted |
| Luna C      | auth                  | Accepted |
| Luna D      | dashboard             | Accepted |
| Luna D      | settings              | Accepted |
| Luna D      | dev-settings          | Accepted |
| Coordinator | component-library     | Accepted |
| Coordinator | experience            | Accepted |
| Coordinator | Shared Infrastructure | Accepted |

### Feature Requests Gate

All eight module files and both route callers reviewed. Focused ESLint and whitespace checks pass. Browser at 390px/desktop: create clears only on success; update toast; dirty navigation Keep Editing retains draft; whitespace validation focuses the field; cancel delete retains draft; confirmed deletion returns to list and removed only the verification record. Empty URL query, simulated 503/retry with failed-create draft retention, bounded loading and populated recovery verified. No horizontal overflow at 390px. Anonymous API returns 401; public demo session keys contain no tokens. The final serialized project check passes.

### Users Gate

All ten files and three route callers reviewed; normalized TypeScript AST diff reviewed in full. Focused ESLint and whitespace pass. Demo desktop directory, detail, empty query and simulated retryable error checked. Profile: blank-name validation focuses First Name; dirty navigation safe action retains draft; successful save updates profile toast and public session; failed simulated save retains typed draft and inline error; email remains read-only; 390px profile fits without overflow. Restored original synthetic first name and Populated simulation. New model exports preserve callers. Final serialized project checks pass.

### Notification Inbox Gate

Full normalized diff and all new models reviewed, including corrections to independent view/mutation models, row/channel composition and nested live/demo service MARKs. Focused ESLint/whitespace pass; serialized project typecheck passes after all extraction imports settle. Browser verified single read/unread counts, search/no results/clear, archive confirmation safe focus and cancellation, saved preference toggle/restore, manual timezone save and automatic restore, failed-save retained preference choices/discard, query error with Try Again, empty scenario and populated recovery. Inbox and settings fit 390px without document overflow. HTTP verifies SELECTED bulk read/restore, zero-match FILTERED archive (no fixture removed), invalid timezone 400, preferences/settings reads. Demo push explanation inspected; no permission requested.

### Chat Gate

All four module files plus route/container/realtime callers reviewed. Focused lint/whitespace and project typecheck pass. Corrected collection to focused renderMessageRow with unchanged key. Browser checks: seeded log, send success and cleared compose input, local simulated alert, failed send retains controlled draft, empty scenario without record removal, populated recovery, 390px no overflow. Polling/invalidation/await and subscription ownership unchanged by full diff review. Only a synthetic demo chat message was added; this process was created for verification.

### Blog Gate

All module changes reviewed through full normalized TypeScript diff, new props/mutation models and schema moves; all direct caller exports reviewed. Corrected missing revision import and split independent cover-preset/image-url models. Focused lint/whitespace and serialized typecheck pass. Public browser search/no-results/clear and structured article reader inspected at 390px. Staff directory and editor checked: validation focuses title, block palette/add divider, local preview retains current title, save feedback, safe-focus publication and delete-cancel dialogs, published state and 390px no overflow. A deliberate external demo revision change produced the expected conflict message while preserving the typed draft. HTTP: ordinary staff API403; draft create201/public404; local PNG upload201; saved/published revision and public200; stale revision409; public limit1 paging; unpublish200/delete204/public404 cleanup. Only the synthetic verification article was deleted; seeded articles remain.

### Dashboard Gate

Full six-file/route/container/query/model review completed; no state owner/hook/dependency changes. Focused lint/whitespace and serialized typecheck pass. Browser verified model URL selection (user registry → seven rows), Compact/Comfortable restoration, no-records/analytics hidden for the admin account, error/Retry, bounded Loading Workspace Data, and populated-user metrics/two records/chart sections. At 390px the Records scroller is 278px wide with 483px scrollable content and document width remains 390px. Desktop chart/header/metric composition visually inspected.

### Onboarding Gate

Reviewed all seventeen files/new props models and direct route/gate/proxy/container callers, full normalized diff, retained hook callbacks, and corrected Stepper contextual union typing. Focused lint/whitespace pass; serialized project typecheck passes. Browser: incomplete account enters Profile, blank first name focuses validation, save advances, reload resumes Preferences, dirty preferences disable Back, timezone popup fits 390px and Escape restores trigger focus, saved choices appear in Review, Finish Setup follows allowed `/feature-requests` return path. No document overflow at 390px. HTTP: invalid-shaped completion400; correctly shaped out-of-order completion403; incomplete protected feature API403. Demo recovery intentionally remains available. Completed only the isolated seeded onboarding account; no live calls.

### Engagement Gate

Full eighteen-file normalized diff, new independent input/page/props models and callers reviewed. Preserved timestamp evaluation before named like-count filtering. Focused lint/whitespace and serialized project typecheck pass. Browser: like/save/four-star update, clear-rating safe focus and successful clear, restore like state, saved-list search/no results/clear, removal safe focus/success/empty, 390px no overflow, signed-out loading then account prompt with encoded article return URL. HTTP: anonymous401, draft target404, saved published target200, unpublished target becomes null without exposing metadata, unavailable save removal204, synthetic target cleanup204. Seeded articles unchanged.

### Settings Gate

Reviewed all eleven files/new models, provider and route/library/shell callers, normalized diff and unchanged CSS/token/catalog data. Focused lint/whitespace and serialized project typecheck pass. Browser verified Blueprint/Light persists after reload; Reduced motion DOM attribute; keyboard Brightness 64→65 with matching progress; local notification switch/toast/reset; live project draft retained when changing theme; shell toggle; 390px no overflow. Restored the original Dusk/Dark/Follow Device Settings and default preview values. Demo notification/analytics explanations inspected without permissions or external events.

### Auth Gate

Full ten-file normalized diff/new models and login/signup/onboarding callers reviewed, including focused demo-option composition. Focused lint/whitespace and serialized typecheck pass. Browser: invalid sign-in and signup render inline errors without clearing visible name drafts; password remains masked; external redirect falls back to Dashboard after valid sign-in; signup links preserve encoded internal return path; disposable demo signup completes onboarding and arrives at `/saved`; 390px signup has no overflow. Existing auth catch ordering calls focus while inputs are still disabled before pending is cleared; browser focus was BODY after failure. This ordering is identical in HEAD and was preserved, not counted as a migration success or fixed incidentally. Exact credential values were not included in verification output. The disposable signup is reserved for Account Tools cleanup.

### Dev Settings Gate

Reviewed all five module files, direct route/API/container/guard contracts and full normalized diff; the settings update remains returned without await. Focused lint/whitespace pass; no module diagnostics in serialized TypeScript runs. Browser checked invalid -1 latency with aria-invalid and disabled Apply, dirty latency safe-navigation cancellation retaining 50, Empty update and Populated restoration/toast, reset safe-focus/cancel, and 390px no overflow. Earlier module gates exercised bounded loading/error scenarios and preset switching. Live runtime was not enabled; shared reset verification passed after the disposable-account cleanup.

### Account Tools Gate

Reviewed all 51 files, complete normalized diff/new models and direct callers. Corrected independent HelpSection, DeliveryFilterValues, LegalItem and FAQ section models. Focused lint/whitespace and serialized TypeScript pass. Browser verified deletion safe focus, exact-email/acknowledgement gating, cancellation and successful removal of only the disposable signup, redirect to login and subsequent login401. Devices: owned seeded rows, empty disposable account, search/no results/clear, removal safe focus/cancel. Help: FAQ expansion and legal panels; superadmin deliveries: read-only attempts and invalid-UUID inline validation with focused field. Narrow screens remain 390px without document overflow. HTTP confirms ordinary delivery403, foreign-device delete404, and token-free device response keys. Runtime literal differences are explained by canonical enum reuse and reused identical desktop/mobile action helpers; hooks/dependencies and await counts are unchanged.

### Component Library Gate

Reviewed all 40 source/model files, full normalized diff and stable module-scope preview children. Focused lint/whitespace and serialized TypeScript pass. Runtime literal, hook-owner/dependency and await-count audit has no differences. Browser verified 23-family catalog/search/no-results/clear, preview heading focus, typed description retained across next/previous preview, local upload failure/retry/completion, bulk partial failure retaining the failed selection, confirmation safe focus/cancel/reset, and desktop table/mobile list alternatives. No document overflow at 390px. No files or notifications were sent externally.

### Experience Gate

Reviewed both files, all direct route callers and the complete original screen/section extraction. Runtime literals, hook owners/dependency arrays and await counts are unchanged. Focused lint/whitespace and serialized TypeScript pass. Browser verified section navigation, alert/sheet safe focus and dismissal, exclusive FAQ expansion retained across scroll and viewport changes, motion disable/default restoration, and desktop/narrow content. Document width is 390px at the narrow viewport. Scroll listeners, observer registration and animation-frame cleanup remain in the original screen effects. No product copy or style tokens changed.

### Shared Models, Queries, Utilities, And Containers Gate

Audited the complete model, error, utility, query, config, library, store and container slice. Split independent sort direction/demo scenario/store state/density/schedule-input models and each domain error while retaining compatibility exports and class identity. Related schema/type/input declarations remain together. Full normalized non-layout diffs reviewed; return locals preserve call/await/closure scope, query configuration and History API behavior. Focused lint, serialized TypeScript and whitespace checks pass. Existing route/module gates cover consumers; final integration repeats directory navigation, session errors and density behavior against the complete shared source.

### Shared Services And Demo/Live Adapters Gate

Audited all 86 service files and their direct module/container/route callers. Reviewed every normalized code diff, explicit operation-specific MARK labels, method-interface grouping, model extractions and media/notification/privacy composition. Split request options/context, demo paging/password records, notification options, profile transport and independent props; retained narrow exports. Scoped lint, serialized TypeScript and whitespace pass. Runtime literal, hook-owner/dependency and await-count audits have no differences. Browser verified local demo notification opt-in/disable without native permission, reset safe focus/success, recreated current session and restored seeded chat data. Demo remains isolated from Firebase, Socket.IO, Messaging and Amplitude. Production API smoke repeats proxy and permission boundaries after route integration; no live integration is asserted.

### Routes And Proxy Gate

Reviewed all 47 maintained route source files plus proxy, complete normalized diffs, extracted input/route-props models and current installed Next route/cookie/page documentation. Async cookies/params, reserved exports, route strings, headers, cache behavior, live refresh retry and permission/onboarding checks are unchanged. Thin route files remain route composition. Exact MARKs cover concrete handlers, forward helper and HTTP aliases. Messaging worker text received layout/braces only; demo endpoint remains empty JavaScript. Focused lint/whitespace and serialized TypeScript pass. Demo HTTP: login200/public token-free projection; users/feature/dashboard/devices200; anonymous401; restricted deliveries403; cross-origin session mutation403; malformed path400; invalid auth400; profile refresh200; public blog200. Browser public article renders correctly at 390px. No live integrations exercised.

### Providers, Presentation, And Themes Gate

Audited all provider/presentation/theme files and new independent context, queue, configuration, props and CSS-variable models. Full normalized code diffs and direct consumers reviewed. Provider nesting, hook owners/order/dependencies, return promise awaiting, guard re-entrancy, overlay occupancy/queue advancement, listener/timer cleanup, theme values and DOM remain intact. Focused lint/whitespace and serialized TypeScript pass. Provider/presentation runtime literal and hook/await audits have no differences; embedded theme and messaging scripts compare structurally equal after normalizing whitespace and control-flow braces. Browser verified link/App Back safe focus and draft retention, theme Light persisted through reload, restored Dusk/Dark, reduced-motion toast and restored system preference. Native Browser Back from a dirty profile after a canceled link confirmation returned to Users in this browser; temporarily loading the original three guard/history implementations reproduced it exactly, and all migrated files were restored byte-for-byte. This pre-existing/tool-path limitation is recorded separately and is not counted as a passing guard flow. No speech/microphone permission requested.

### Shared UI Gate

Reviewed all 216 original component/control/layout/helper files, the full normalized runtime diff and all 109 independent extracted models, plus direct consumers. Canonical props, discriminated table selection contracts and compatibility exports are retained. Hooks, state ownership, dependency arrays, awaits, runtime literals, keys, markup, class names and CSS values are unchanged. Review caught and corrected one Combobox event-local lookup before acceptance. Focused ESLint, serialized TypeScript, whitespace and preservation audits pass. Demo browser: Combobox selection/blur reversion/clear/disabled/error/retry; table page selection/partial failure retaining only failed selection at desktop and 390px; bounded calendar popup/inclusive range/return focus; keyboard slider step and range bounds; multi-select limits; Markdown current draft preview and undo; upload loading/failure/retry/completion; alert/sheet safe focus/dismissal; nested Select first-Escape popup dismissal and second-Escape dialog dismissal returning to the opener; mobile shell navigation and App Back draft retention. Defaults and local examples restored. Narrow document has no horizontal overflow. Existing baseline auth/native Browser Back limits remain as recorded above. No live requests or native permission prompts.

### Tooling, Configuration, And Catalog Gate

Reviewed maintained root configuration, all source-check scripts, six focused standards rules, the existing title-case rule and the complete strings diff. All maintained JS/TS now receives standards lint without rollout exclusions; existing Next/copy/color/shared-control/Tailwind checks remain enabled. Source scanners retain recursive behavior after deliberately avoiding result-name shadowing. Strings keys and output literals, CSS values, package dependencies and application configuration values are unchanged. Exact switch-body padding is covered by the existing block rule. ESLint owns code; non-code Prettier excludes generated/code files and embedded Markdown code. Project check passes with zero warnings. Canonical formatting idempotence, production build and production smoke passed as recorded above.

## Cupertino theme and value controls — November 2, 2026

- Added the selectable macOS / iOS (`cupertino`) light/dark preset and eight shared controls: Slider, RangeSlider, ProgressBar, ProgressRing, NumberStepper, Meter, ActivityIndicator, and Skeleton. Existing switches and segmented selections consume the optional theme control roles. No default preference was changed.
- `npm run check` passed: zero-warning ESLint, route-aware TypeScript, Next.js editor diagnostics, centralized strings, semantic colors, shared-control ownership, and Tailwind class checks.
- `DEMO_MODE=true npm run build` passed, generating all 31 static pages and compiling all application routes. `git diff --check` passed. No tests were written or Xcode builds run.
- Browser verification used the existing local demo server at port 3001 and a demo account. Checked Apple light/dark rendering, 390×844 narrow layout without document overflow, single/range/vertical sliders, arrow/Home/End interaction, invalid input association and error clearing, numeric clamp from 99 to 12, disabled bound/read-only buttons, local progress interruption/retry/completion, indeterminate ARIA values, and saved reduced motion (computed animations were `none`).
- Verified Blueprint's square track/thumb geometry and Portal's original 10px thumb corners, theme persistence after reload, and the shared specimens on Appearance. Restored the browser's original Arcade/light/system-motion preferences and cleared the temporary viewport override. The preview made no live backend, analytics, messaging, or notification calls. Desktop screenshot: `/tmp/portal-cupertino-controls.png`.
- Official `designmd lint DESIGN.md` returned zero errors and three existing orphaned-token warnings. The supplemental strict premium audit returned 39 heuristic flags; 37 refer to existing patterns and two flag NumberStepper's context-wired decrement/increment buttons. Their React Aria slot actions, numeric bounds and disabled behavior were verified in the browser. The audit does not understand these context-owned actions, shared Select wrappers, or shared textarea styling; it is not a clean compliance result. Full JSON evidence: `/tmp/portal-cupertino-audit.json`.

| Design rule                                      | Evidence                                                                                                                                                                                                       | Reconciliation                                                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Preset objects own appearance                    | New optional control roles compile through existing `--portal-*` registrations                                                                                                                                 | Matched; no theme-ID branches in consumers                                                                                          |
| Six selectable identities                        | Seven registered identities after this addition                                                                                                                                                                | Updated theme inventory and canonical ownership documentation                                                                       |
| Existing Portal prose mirrors its preset exactly | The pre-existing DESIGN frontmatter lists background `#f7fafb` and text `#111827`; the current Portal object uses `#f3f7f7` and `#17252b`, with other baseline differences in selection opacity/sidebar radius | Recorded existing drift; preserved the current Portal implementation and prior baseline documentation while adding a separate theme |

These are local component/demo checks. They do not establish complete equivalence with native Apple widgets, a cross-device assistive-technology certification, or live integration correctness. See [value controls](VALUE_CONTROLS.md) for APIs and ownership.

Verified locally on October 4, 2026 with Node 22, Next.js 16.2.10, React 19.2.4, and `DEMO_MODE=true`. No test files were written and no Xcode builds were run.

## Static and production checks

- `npm run check`: ESLint, Next.js route type generation, TypeScript, and the display-string check pass.
- `DEMO_MODE=true npm run build`: optimized Turbopack production build passes, including the backend proxy, authentication routes, and Messaging worker route.
- Frontend Design Premium static audit in strict mode: no findings.
- `git diff --check`: no whitespace errors.
- Installed versions match the requested exact Next.js and React versions. Source has no Firebase Auth browser SDK, Firebase Admin, frontend Sentry, or old workspace package imports.

The string check is a guard against inline display copy, including default messages and loading labels. Review dynamic copy and third-party content as described in [STRINGS.md](STRINGS.md); it is not a substitute for localization review.

## Manual workflows

| Area                  | Observed result                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Demo login            | Seed credentials sign in; the public response contains user information and expiry without Firebase tokens.                                                                                     |
| Demo signup           | A new account can sign up, edit its own profile, and sign out.                                                                                                                                  |
| Profile               | Saving through the browser uses `PUT /users/:id`, refreshes the public session, and displays the shared success toast. A different account receives 403 when attempting the same user's update. |
| Feature requests      | Browser creation persists across reload. Editing and deletion of the verification record succeed. A different account cannot read that record.                                                  |
| Chat and alerts       | A sent demo message survives reload. Simulated alerts use the shared, dismissible toast. Empty messages receive 400.                                                                            |
| Session refresh       | An expired demo access token refreshes server-side, reissues the encrypted cookie, and returns no private tokens in JSON.                                                                       |
| Request boundaries    | An unauthenticated backend request receives 401. A mutation with a foreign Origin receives 403.                                                                                                 |
| Integration isolation | Demo settings explain disabled analytics and simulated notifications. The demo Messaging worker has no live configuration or code.                                                              |
| Responsive layout     | Profile and Appearance were inspected at 390px; chat at 1280px. The checked screens had no horizontal document overflow. Temporary viewport overrides were removed.                             |

Temporary feature-request verification data was removed. Existing demo content was preserved. The demo server was not restarted to clear the user's active session or chat state.

## Title-case copy verification — October 12, 2026

- `npm run check`, `DEMO_MODE=true npm run build`, and `git diff --check` pass for the title-case catalog and lint changes.
- An in-memory ESLint check of the catalog with `Save Profile` changed to `Save profile` reports the expected `copy/title-case` error. The actual catalog remains valid; no test files were written.
- Local demo browser review covered sign-in copy, dashboard headings and table headers, navigation action names, profile field labels and the save CTA, and the shared component library's headings, controls, and feedback titles. Profile labels fit the browser's compact layout. Supporting prose, sample Markdown, demo credentials, and record content retain their original case. No profile or domain mutations were submitted.
- Live backend, analytics, and push integrations were not exercised for this copy change.

## Shared UI foundation verification — October 12, 2026

- `npm run check` passes without warnings: ESLint, route type generation, TypeScript, display strings, semantic colors, and shared UI ownership.
- `DEMO_MODE=true npm run build` passes for the component library and existing application routes. `git diff --check` passes. No tests were written and no Xcode builds were run.
- All 22 pasted Tailwind IntelliSense canonical-class diagnostics in Select and MultiSelect were addressed. Production browser inspection confirms the canonical classes generate selected backgrounds/text, keyboard focus outlines, trigger-width popups, themed borders, and overlay shadows.
- `npm ls react-aria react-aria-components` confirms React Aria Components 1.21.1 shares the single React Aria 3.52.1 dependency. The direct dependency is pinned exactly; upgrades must retain a shared PortalProvider context.

| Area                   | Observed demo result                                                                                                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component route        | Demo sign-in reaches the protected component library. One page h1 and one component scroll legend; the duplicate section dropdown is removed.                                                                                                  |
| Stepper                | Horizontal stages share a row; vertical stages share a column. Selecting a stage synchronizes both specimens' complete/current states. Labels fit at 390px and 1280px with no horizontal document overflow.                                    |
| Theme states           | Blue selections use the same surface blend across tiles, chips, and listbox options: 8% in light mode and 14% in dark mode. Section-card hover uses the shared accent/surface token. Success, warning, and error retain their semantic colors. |
| Motion                 | Saved Reduced motion survives reload and removes indicator/button transitions. Four-choice segmented controls use the authored Select at compact widths; two choices retain their capsule.                                                     |
| Mobile navigation      | At 390×844 the menu fills the viewport, focuses its close action, and restores the opener after Escape.                                                                                                                                        |
| Select and MultiSelect | Selecting two MultiSelect options gives both the themed fill; keyboard movement shows a visible brand outline. Clearing selections returns the placeholder. Popup shadows and borders render after the canonical-class cleanup.                |
| Modal popup            | At 390×844 the Select popup stays inside the dialog and its focus scope, fits the trigger and viewport, and closes on the first Escape while the dialog remains open. The next Escape closes the dialog and restores Open Dialog focus.        |
| Directory preview      | An unmatched local search shows the empty state; clearing the search restores rows.                                                                                                                                                            |

Verification used local demo data. Temporary selections were cleared, preview appearance was restored, and viewport overrides were reset. No live backend mutations, analytics events, notification permission prompts, or assistant-generation integrations were used.

### Supplemental audit limitations

The Frontend Design Premium strict text audit reports 17 findings in this component-based implementation: nine authored `<Select>` usages misread as native `<select>`, seven composed/prop-forwarding actions it cannot trace, and one shared TextArea whose inherited `resize-none` is not visible at its caller. These were reviewed against the shared implementations and manual workflows; the report is not a clean audit. The repository's TypeScript-based shared UI check passes and distinguishes component identifiers from native elements.

The supplemental DESIGN.md linter reports no errors and three unused-color warnings for the documented text, muted, and border roles. Runtime CSS remains canonical; these entries record the accepted palette rather than generate utilities.

## Editor warning cleanup — October 12, 2026

- `npm run check` now fails on any ESLint warning, Next.js editor plugin diagnostic, or non-canonical Tailwind class. It passes with zero warnings. `DEMO_MODE=true npm run build` and `git diff --check` pass.
- Tailwind classes were rewritten only to the canonical form reported by the project's own design system. A comparison against `HEAD` confirms each file's class lists are unchanged apart from those rewrites. Replacements that resolve through theme variables use equal values: `--radius-3xl` is 1.75rem, `--spacing` is 0.25rem, and `--container-3xl` is 48rem.
- Route `metadata` exports are typed as `Metadata`. Barrel-exported interactive components keep `'use client'` and declare named props interfaces. Two preference providers, `useReviewedDraftAssistant`, and three client-only sub-parts dropped the unneeded directive.
- A demo production server returned 200 for sign-in, signup, and all protected routes after demo sign-in, and 404 for the server-rendered not-found page, with no server errors. Interactive overlay and selection behavior was not re-exercised in a browser; these changes are type-level, directive, and CSS-equivalent class edits.

## Live integration limits

Firebase REST authentication/refresh, backend provisioning and authorization, Socket.IO ticket issuance/broadcasts, browser permission/device registration, FCM foreground/background delivery, and Amplitude event delivery require real configuration and backend endpoints. Those external flows were not exercised. No production analytics events or push permission prompts were triggered.

The live backend must implement [BACKEND_CONTRACT.md](BACKEND_CONTRACT.md) and [REALTIME.md](REALTIME.md). Demo state is process-local and resets on restart; it is not durable or shared across replicas. Production rollout should verify these integrations in a configured staging environment, including multi-instance refresh behavior and notification cleanup.

## Component Families And Catalog — November 3, 2026

Added Avatar/AvatarGroup, UploadField/FileList, DataTable selection/BulkActionBar, Combobox, and DateRangePicker, with independent public models and shared-library exports. Replaced the continuous component page with a searchable, categorized catalog and focused stateful previews. Cards share the same left inset and have no New chips. Switches share the interaction-only checkbox/radio pop and halo, including the saved/device reduced-motion rules.

- `npm run check` passed: ESLint, route-aware TypeScript, Next editor diagnostics, copy, semantic colors, shared controls, and canonical Tailwind classes. `DEMO_MODE=true npm run build` passed. `git diff --check` passed. No tests were written.
- Demo browser checks covered catalog search/no-results, category Back/Forward restoration, focused previews, avatar image fallbacks and the overflow people popover, upload type/size rejection, local progress/failure/retry/completion/cancel, combobox keyboard selection and Escape restoration/clear/no-results/remote error/retry, range calendar opening/selection/clear, and mixed table selection with explicit all-results scope and partial-failure retention. The destructive preview opened the shared confirmation with the safe action focused.
- Desktop and 390px phone layouts were inspected. The mobile catalog and selection example had no document horizontal overflow. The open range calendar remained inside the phone viewport. All 23 catalog cards measured the same 21px text/icon inset in the inspected theme. Toggle computed animation names changed from none on initial checked render to the shared pop/halo after interaction. Light and dark rendered states were inspected; this was not an exhaustive seven-theme or screen-reader audit.
- The supplementary generic design auditor was stopped after exceeding a 20-second bound; no clean result is claimed from it. Repository-owned checks and the browser observations above are the verification evidence.
- Upload transfers and remote searches in the showcase are local simulations. No live backend writes, analytics events, push permission prompts, or external uploads were performed. Consuming domains remain responsible for server validation, cancellation/stale results, bulk scope/authorization, and real transfer behavior.

## Project Foundation, Chat, Jobs, And Interaction Refinements — November 3, 2026

- Integrated conversation chat, an owner-scoped job queue, project initialization, dependency maintenance, uniform protected-page widths, theme-owned avatar/switch shapes, and configurable overlay entrances. All new display copy remains in `src/strings.ts`; independent models and component props are split near their owners.
- `npm run check` passed with zero warnings, including route-aware TypeScript, Next editor diagnostics, strings, semantic colors, shared controls, and canonical Tailwind. The canonical code formatter's second pass left source unchanged. `DEMO_MODE=true npm run build` passed on Next.js 16.4.5. `git diff --check` passed. No test files, worktrees, or Xcode builds were created/run.
- `npm audit --omit=dev` reports zero vulnerabilities. The full high/critical gate passes; 16 moderate development-tool findings remain documented in [dependency maintenance](DEPENDENCIES.md). Weekly audit and Dependabot files are configured but were not executed on GitHub from this local task.
- Manual demo HTTP workflows verified shared group visibility across two identities, nonmember message/file denial, author-only edits/deletion, attachment content, idempotent sends, and archive state. Job workflows verified202 enqueue, duplicate request identity, foreign-owner404, failure without browser polling, retry of the same job, stale-attempt409, and success with retained attempt history. Only synthetic verification records were changed.
- Initializer verification used disposable fixtures: all four profiles, guided terminal setup, dry runs, demo/live environment output, package/lock slug consistency, private environment permissions, protected reruns, local image validation, symlink refusal, credential redaction, generated-source lint, and rollback after a simulated filesystem failure. The actual project environment/configuration was not initialized.
- Browser review verified outgoing Shift+Enter delivery appears in67 ms while the demo response simulation deliberately waited five seconds. The pending item was visible before the server response. Normal responses were restored afterward. The one-line composer, shortcut hint, compact reaction menu, grouped details, and responsive chat presentation were inspected.
- Development traces exposed the artificial Loading scenario's approximately2.5-second delay. Normal demo reads sampled7–14 ms and recent development request spans had a16 ms median. Active simulations are now visible in the shell, with a non-destructive Use Normal Responses action.
- At2701px desktop width, main content measured2418px before and during a dialog with body margin-right0. At664px narrow width, alert and sheet previews retained653px main content width and margin-right0; computed entrances were `ui-dialog-enter` and `ui-sheet-enter` at0.42s. Both opened with the safe Cancel action focused.
- The supplemental generic frontend auditor exceeded its bounded run and was stopped without a completed report. No clean generic-auditor result is claimed. Repository-owned checks and observed manual flows are the evidence.

Live chat storage/events/private media, durable backend job workers, Firebase authentication, realtime/push delivery, and analytics were not exercised. Demo records and uploads remain process-local and reset when the development server restarts. The stopped development server was restarted during this work; seeded fixtures were reloaded.
