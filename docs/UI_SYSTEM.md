# Reusable UI foundation

Every Portal project starts with the LeafLaunch Web component foundation in `src/components/ui`. Open the authenticated `/dev-settings/components` route to inspect foundations, motion, page patterns, controls, states, tables, reordering, Markdown, and media. Examples use local state only. Appearance and the library share the same theme/motion controls. The component browser uses a searchable card catalog, six category choices (a shared Select on phones), and one focused family preview. Category and preview choices live in URL history; visited previews remain mounted to preserve local state.

## Ownership and inventory

Import components from `@/components/ui`. Search this library before creating another control. Keep independent models under `src/components/ui/models`; feature models and server orchestration remain in their domains. All labels, previews, accessibility text, and formatters belong in `src/strings.ts`.

| Family                 | Shared building blocks                                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Foundations            | UiIcon, IconTile, Avatar/AvatarGroup/InitialsAvatar, Button/IconButton, Spinner, semantic color/type/radius/motion tokens                                                                                                                                                                              |
| Forms                  | Field, Input/PasswordInput, TextArea, Select/MultiSelect/Combobox, DatePicker/DateRangePicker, ColorInput/ColorPickerValueField, MoneyInput, AddressSelect, TimezoneSelect, Checkbox/Radio/Switch, RadioCard, SelectionTile/SelectionChip, ConfirmationChoice, FileInput/DropZone/UploadField/FileList |
| Page composition       | Page, PageHeader, Breadcrumbs, PageSection, SectionStack/SplitSection, FormSection/SectionCard/SectionCardView, FormActions, DescriptionList, Card/CardView, DataPanel                                                                                                                                 |
| Records and navigation | DataTable with controlled selection, BulkActionBar, MobileRecordRow, TableRowLink, DirectoryFilters/DirectoryMultiFilters, DirectoryPagination, ListGroup/ListRow, ReorderableList, Stepper, responsive segmented navigation and persistent panels, NavigationLink, HorizontalCarousel                 |
| Feedback and layers    | Message, Badge/Chip, QueryBoundary/InlineLoading, EmptyState/ErrorState/RecoveryButton, Tooltip, InfoPopover, IconMenu, Modal, AlertModal, SheetPanel, ToastStack, Accordion, StarRating/RatingSummary, ReactionButton/BookmarkButton, ContentTransition                                               |
| Media and editing      | ImageMosaic/ImagePreview, RecordThumbnail, MarkdownEditor/MarkdownContent, location/timezone schedule summaries and local-time fields                                                                                                                                                                  |
| Reviewed assistance    | FloatingAssistantProvider, FloatingAssistant, ReviewedDraftAssistant/ReviewedDraftChat, typed suggestion review, optional browser dictation                                                                                                                                                            |
| App shell              | AppSidebar, SidebarLinks, SidebarSwitcherDisclosure, MobileNavigationMenu, AppShell                                                                                                                                                                                                                    |

LeafLaunch's product upload, product image generation, marketing persistence, business roles, and backend-specific widgets are not coupled into this base library. Generic controls receive data and callbacks. A consuming module owns authorized file retrieval, generation, validation, persistence, and query invalidation. The reviewed-assistant callback must use the existing domain service → API client → authenticated proxy architecture.

## Start a screen

Use Page → one PageHeader → work surfaces. The shell header supplies workspace context, not a duplicate page title. PageHeader's lower heading level is reserved for component specimens.

Directories use DataPanel, DirectoryFilters, embedded DataTable, and DirectoryPagination. Supply stable row keys, a visible record link, and optionally MobileRecordRow for narrow browsers. Rows preserve modifier-click and keyboard link behavior. A wide table without a mobile renderer has its own labeled, focusable horizontal scroller. DirectoryFilters owns 300ms debounce, IME-safe submission, immediate clearing, and input focus restoration; domains own committed URL state and stale-request handling.

Forms/settings use SplitSection and FormActions. Do not constrain a long form to a table's viewport frame. Button loading retains geometry and accessible copy. Field associates native and authored controls explicitly. Schedule time/datetime fields intentionally retain their platform popup; date-only workflows may use DatePicker for a calendar owned by the app. Select/MultiSelect own popup geometry, typeahead, keyboard selection, and collision through React Aria.

## Theme and state

Complete typed theme objects in `src/themes/presets` are the canonical appearance source. The compiler adapts colors, foregrounds, backgrounds, corners, border widths/styles, shadows, typography, density, selection, and motion into the semantic vocabulary registered by `src/app/theme.css`. Portal, Studio, Atelier, Blueprint, Arcade, Dusk, and macOS / iOS each supply light/dark modes. Appearance and the component library provide seven scoped preview cards and real shared-control specimens. Selecting a theme applies its complete palette; light/dark mode and reduced motion remain independent controls. See [loadable themes](THEMING.md) for APIs, ownership, compatibility, and adding an object.

ProgressBar, ProgressRing, Slider, RangeSlider, NumberStepper, Meter, ActivityIndicator, and Skeleton fill the progress/value/loading families. Sliders support endpoint icons, ordered ranges, keyboard and touch, vertical layout, and an end-origin fill. All consume semantic tokens and expose configuration rather than owning persistence. The optional `ThemeDefinition.controls` extension controls their geometry and paint plus existing switch and segmented selection details. See [progress and value controls](VALUE_CONTROLS.md) for usage and accessibility contracts; the library's **Progress And Value Controls** section demonstrates their states.

ThemeScript validates stored IDs before hydration and shares the runtime compiler with the provider. The container constructs preference services; providers persist and synchronize browser tabs. Legacy mode/accent records preserve their mode and default to Portal; obsolete accent overrides are ignored. Blocked storage produces an inline failure without pretending the choice was saved.

Selection uses `--color-selection-fill`, `--color-selection-hover`, and `--color-selection-border`. Their opacity changes with light/dark mode and their hue follows the selected theme’s palette. Tiles, chips, listboxes, navigation, and section-card hover/selected states share these roles. Checkbox and focus semantics retain stronger strokes. Keep state opacity in the theme object, not in per-component constants.

## Motion, panels, and steppers

`styles/motion.css` and theme timing tokens own presses, switches, checkbox marks, segmented movement, list transitions, popups, and overlays. JavaScript animation uses `motionPreferences.ts` and `useListMotion`. Both device reduced motion and the saved Reduced preference win. Positioning, visibility, state, and focus still update immediately.

SegmentedTabs is a native radio choice group. Two choices stay as a capsule on mobile; longer groups use the authored Select below 600px. The indicator measures actual labels and responds to resizing and font changes. SegmentedPanels keeps inactive drafts mounted with hidden/inert semantics.

Stepper uses the LeafLaunch horizontal bars by default. Pass `orientation="vertical"` for connected stacked stages or `orientation="responsive"` for container-driven switching at 34rem. The library shows horizontal and vertical examples together. Completed/current/upcoming state and disabled eligibility come from the caller. Stages are real buttons with `aria-current="step"`, numbered/check markers, full descriptions, visible focus, and 44px targets.

## Overlays and guarded drafts

Use PresentationProvider for queued alerts, sheets, and toasts; use Modal for composed forms. Preserve focus restoration, Escape, safe actions first, dynamic viewport bounds, and safe-area spacing. The direct react-aria dependency is pinned to the exact version used by react-aria-components so they share PortalProvider context. Keep these versions aligned during upgrades. React Aria popup portals in Modal stay inside its focus scope; closing a popup with Escape does not close the parent modal. Toasts sit above the overlay stack.

NavigationGuardProvider and useUnsavedFormGuard own guarded navigation. Clean NavigationLink transitions retain Next Link prefetch, push/replace, scroll, and modifier-click behavior. Register dirty/busy refs; app links and same-document Back/Forward then share the app-owned discard dialog. Accepted discard releases the unload guard. Native beforeunload remains limited to actual document exits.

The provider annotates actual history entries while preserving Next's state. It never adds a sentinel entry. A canceled same-document traversal restores its original entry before showing the decision; acceptance replays that existing traversal. Cross-document exits are left to the browser. Use `useGuardedBack(owningRoute)` for application Back actions: return through a known prior in-app entry, or replace with the owning route after a direct entry. Never infer safety from `history.length` or blindly call `router.back()`.

Committed tabs, filters, sorting, and pages push URL history so Back restores the previous view. `useUrlState(key, fallback, allowedValues)` supplies guarded client-owned URL state, and `useDirectoryState` owns query/status/offset directory state. Use replacement only for normalization or explicitly transient state. Segmented controls remain controlled components; their screen chooses URL state when its choices are navigable. Never store private drafts or credentials in browser storage. Optional dictation starts only after an explicit user action; generated suggestions require review and a separate save.

## Added interaction contracts

DatePicker exchanges validated ISO date-only strings (`YYYY-MM-DD`), without inventing a timezone. It supports min/max, required/read-only/disabled/invalid states and a configurable locale. React Aria localizes segments, month and weekday names, navigation, and calendar announcements. English gets the catalog's optional clear action; for another language, provide `calendarLabels` from the same strings catalog to add localized owned actions. Without that pack, React Aria's own locale labels are retained and the optional clear action is omitted. Existing native profile and schedule fields remain supported where OS-owned popups are accepted.

ColorInput includes a typed six-digit HEX value, keyboard commit, copy status/failure, and a bounded scrolling picker. Incomplete or invalid HEX input stays local and never overwrites the parent value. TextArea grows with controlled or native input and width changes; `autoGrow={false}` preserves a fixed footprint. MultiSelect supports `maxSelections`, keeps selected options removable at the limit, and disables Select All if it would exceed that limit.

Accordion supports independent or single expansion, controlled keys, disabled items and heading levels. StarRating uses native radio semantics and distinguishes preview from committed value; RatingSummary receives localized score/count labels. ReactionButton and BookmarkButton are controlled UI only; callers own persistence, authorization, feedback, and errors. HorizontalCarousel keeps native visible scrolling and snap points. ContentTransition animates a revision without remounting contents and respects reduced motion. ReorderableList restores focus to the moved handle, including list edges, and supports a card variant.

IconMenu supports real link destinations, disabled/selected items and destructive intent. The caller owns confirmation before consequential mutations. MarkdownContent's `headingContext="article"` keeps public article headings below the page title; the nested default remains suitable for previews and dialogs. Modal's optional footer sits outside the scrolling body. AppShell accepts `navigationItems`; the application owns enabled modules and role visibility.

QueryBoundary's optional `retainDataOnError` keeps existing content mounted after ordinary refresh failures and shows an inline retry notice. Authentication, ownership, and missing-record failures replace stale content immediately. Busy retry controls prevent duplicates. Consumers still own cancellation, query keys, server pagination, and safe mutation errors.

## Verification and extension

`npm run check` runs ESLint with zero warnings allowed, route-aware TypeScript, the Next.js editor plugin diagnostics, centralized-copy checks, semantic-color checks, the shared-control guard, and Tailwind canonical-class checks. Native button/input/select/textarea/table authoring belongs inside the library.

Server Components import `@/components/ui` (for example `not-found.tsx`), so every interactive file the barrel exports keeps `'use client'`; removing it pulls hooks into the server graph and fails the build. Next's plugin warns when a `'use client'` export declares function props in an inline object type, so those components declare a named props `interface`. Files imported only by client modules, such as providers, internal hooks, and sub-parts, do not need the directive. Literal colors/fixed palettes outside the canonical `src/themes` source are rejected. CSS geometry and component recipes consume the same object-owned semantic roles. Run `DEMO_MODE=true npm run build`, `git diff --check`, and focused demo workflows. Do not write tests.

Add preview states for new reusable controls here. Verify desktop/narrow layout, keyboard, light/dark themes, disabled/busy/error states, popups, and reduced motion. Keep domain integration evidence distinct from component previews. See [verification](VERIFICATION.md), [design context](../DESIGN.md), and [UX contract](../UX-CONTRACT.md).

## Address data attribution

Country/region labels in `src/strings.ts` retain the country-region-data notice:

```text
The MIT License (MIT)

Copyright (c) 2022 Benjamin Keen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Collection And Input Extensions

- `Avatar` accepts a name, optional image, size, and online/offline/busy status. Images fall back to initials on failure. `InitialsAvatar` remains a compatibility wrapper for rows that already display the person's name. `AvatarGroup` accepts stable IDs and a visible limit; its overflow button opens a keyboard/touch-accessible list of remaining people.
- `UploadField` composes the shared picker, drop target, validation, and `FileList`. Provide controlled `UploadFile` items and `onFiles`; use `onReject` for structured type/size/count failures. `accept`, `maxFiles`, and `maxSizeBytes` are client feedback only; the server still validates uploaded content. The control never sends files. A domain upload owner supplies progress, failure copy, cancel, retry, removal, and safe remote preview URLs. Small local image previews are read asynchronously and aborted on cleanup. Removing an uploading file requires cancellation first. Unknown progress stays indeterminate. The showcase simulates uploads locally.
- `DataTable.selection` requires `getRowKey`, controlled `selectedKeys`, `onSelectionChange`, `getRowLabel`, and optional disabled-row rules. The mixed header checkbox selects available rows on the current page while preserving other selected keys; mobile record summaries receive the same controls. `BulkActionBar` receives the explicit count/scope, clear callback, actions, busy state, and optional error. An optional all-results callback is a deliberate domain opt-in: the domain owns the query snapshot, authorization, disabled eligibility, selection reset on filtering, confirmation, and succeeded/failed results. Never interpret page selection as all matching server records.
- `Combobox` commits option IDs only, with separate editable text, disabled options, clearing, local filtering, and authored popup geometry. `onSearchChange` switches to caller-filtered results and debounces remote queries (300ms by default), waits for IME completion, and clears immediately. The caller must cancel superseded requests or reject stale results; `loading`, `error`, and `onRetry` expose recovery. Options, including the committed option while loading, must have stable IDs. The component never fetches. Autocomplete means a searchable entity choice here; arbitrary free text is not committed as an ID.
- `DateRangePicker` exchanges `DateRangeValue | null`, with inclusive ISO date-only endpoints. It supports typed segments, ordered calendar selection, min/max, required/disabled/read-only/error states, optional native form field names, locale, and the same owned calendar-label pack as `DatePicker`. Complete selection commits immediately; Clear emits null. Domain-specific presets, filter Apply/Cancel semantics, timezone conversion, and unavailable-date policies stay with the consuming workflow.

The catalog's `component` and `category` query parameters are shareable and restore with Back/Forward. Search is intentionally transient, local discovery state. Hidden visited examples use hidden/inert semantics; unvisited examples are not mounted. The Theme family retains the existing shared theme/motion controls. All catalog cards align their icon and copy to the same left edge.

Switches now share the checkbox/radio pop and halo when a person enables the control. Initial checked values and disabled switches do not trigger it. The halo uses the switch's own theme color. Device and saved reduced-motion settings suppress both frame motion and halo.

## Overlay Motion Preferences

Appearance → Overlay Entrances uses shared Sliders and Select to tune entrance duration, starting scale, travel distance, and feel for alerts, side menus, and toasts. `PresentationMotionPreferenceService` is constructed in the client container (and the existing public engagement composition boundary) and injected into `PresentationProvider`. Its validated browser preference is stored under `portal-presentation-motion` and synchronized across tabs.

Theme defaults resolve to 320–420 ms, a theme-derived starting scale, and 20 px travel. Reset removes overrides so later theme changes remain authoritative. Per-request `motion` settings and scoped `configureMotion` previews are separate from saved preferences. Legacy Experience presets dispose their temporary overrides on replacement and unmount. Saved/device Reduced Motion always suppresses movement.

Dialogs scale and translate independently from their fixed centering; sheets enter from their edge with subtle scale; toasts use position-aware travel and scale. Presentation actions resolve immediately. Only visual queue turnover waits for the exit animation's completion, with a bounded fallback for disabled/removed CSS. Toast removal follows the same exit snapshot. A caller that conditionally unmounts a generic Modal can show its entrance but must keep it mounted with `open=false` to retain an exit.

The document reserves a stable scrollbar gutter. On supporting browsers, the shared body scroll-lock rule suppresses the overlay library's additional right margin; it preserves scroll locking, focus containment, and nested overlays without shifting the page width. Browsers without stable-gutter support retain the library's normal compensation.
