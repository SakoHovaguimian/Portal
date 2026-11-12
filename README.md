# Portal

A single npm application built with Next.js **16.4.5**, React **19.2.4**, strict TypeScript, Tailwind CSS v4, and TanStack Query. Domain modules call an API client through an authenticated Next.js backend proxy. Shared React Aria/Radix UI primitives and Portal’s loadable light/dark theme objects live in the same application.

## Start with the demo

Requires Node 22.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3001. The sample environment sets `DEMO_MODE=true`. Choose New User, Populated User, Onboarding, Admin, or SuperAdmin on the sign-in screen, or create an account. All sample accounts use `password123`; the original `sako@example.com` login remains available. New User has completed setup and no private activity; Onboarding restarts only its own setup and activity. Demo mutations remain in server memory across navigation and reloads.

Demo mode includes users, profile updates, feature requests, dashboard counts, conversation-scoped chat, background jobs, resumable onboarding, publishing, uploads, saved content, a notification inbox, and account tools. `/dev-settings` controls populated/loading/empty/error responses, finite latency, account switching, and a full fixture reset. It makes no Firebase, backend, Socket.IO, Messaging, or Amplitude calls. Browser notification opt-in is simulated per account.

To let someone try the local app remotely, install `cloudflared` and run `npm run share`. Control + C stops the tunnel and development server it starts. See [remote sharing and backend port overrides](docs/SHARING.md).

## Start a new project

Run `npm run initialize -- --help` for guided setup, or preview a preset:

```sh
npm run initialize -- --yes --profile internal-tool --name "My Workspace" --slug my-workspace --theme studio --dry-run
```

The initializer configures identity, local brand assets, theme defaults, capabilities, ordered navigation, environment, and starter data. It validates before writing, protects existing settings, and supports an explicit `--force` after review. Product copy stays in `src/strings.ts`; runtime settings live in `src/config/projectConfiguration.ts`. See [project initialization](docs/PROJECT_INITIALIZER.md).

## Reusable Modules

Choose project capabilities in [project configuration](src/config/projectConfiguration.ts), exposed through [portalModules](src/config/portalModules.ts); disabled modules are removed from navigation and rejected at the API boundary. [Portal navigation](src/config/portalNavigation.tsx) composes destinations from those capabilities and the trusted role. The core remains one npm application.

- `/admin/blog` provides revision-checked drafts, typed content blocks, previews, publication, and public `/blog` readers. See [publishing](docs/BLOG.md).
- `/chat` provides direct messages, group conversations, attachments, replies, reactions, message management, and member-aware access. See [chat](docs/CHAT.md).
- `/jobs` provides an owner-scoped work queue with progress, cancellation, attempt history, failure recovery, and explicit retries. See [background jobs](docs/BACKGROUND_JOBS.md).
- `/notifications` provides unread counts, search, bulk actions, channel preferences, and scheduling timezone; `/saved` keeps account-owned bookmarks across registered content types.
- `/settings/account`, `/settings/devices`, and `/help` provide account, device, FAQ, and illustrative demo legal screens. Delivery diagnostics require the platform role and independent backend authorization.
- `/onboarding` resumes saved profile/preferences steps. Configure its descriptors in `src/modules/onboarding/onboardingConfiguration.ts`; opt into its live API with `PORTAL_ONBOARDING_ENABLED=true`.

Committed tabs, filters, and paging create real browser history entries. The app's Back action returns to a tracked internal entry or the owning fallback. Unsaved forms use the shared guard, including same-document browser Back. Developer Settings and Component Library share one adjacent utility group in the sidebar.

## Component foundation

Open `/dev-settings/components` after signing in. Portal includes the LeafLaunch shared component foundation and editable HEX color picker, date-only calendars, disclosures, ratings/reactions/bookmarks, card carousels, mobile navigation and record layouts, animated segmented controls, steppers, persistent panels, Markdown editing, and media previews. Seven complete themes drive shared colors, corners, borders, shadows, typography, spacing, and motion throughout. See [loadable themes](docs/THEMING.md). Previews stay local. Read [UI system](docs/UI_SYSTEM.md) before extending a screen.

## Live mode

Set `DEMO_MODE=false`, provide `PORTAL_API_URL`, `FIREBASE_WEB_API_KEY`, and a random `SESSION_SECRET` of at least 32 characters, then restart. `PORTAL_API_URL` includes the backend prefix, such as `http://localhost:3000/api`. Configure optional Socket.IO, Firebase Messaging, and Amplitude values from [.env.example](.env.example).

The backend must implement the [documented contract](docs/BACKEND_CONTRACT.md). This frontend does not create backend chat, ticket, device, or business endpoints. Missing live integrations are not silently replaced with demo data.

Authentication uses Firebase REST on the server. Access and refresh tokens live in an encrypted HTTP-only session cookie. Browser calls use `/api/backend/*`; the proxy refreshes tokens and forwards the bearer and app-version headers. Socket.IO uses short-lived tickets. Firebase Messaging is explicitly opt-in. Amplitude loads only after consent; no Sentry frontend integration is included.

## Commands

```sh
npm run dev
npm run share
npm run check
DEMO_MODE=true npm run build
DEMO_MODE=true npm start
npm run check:strings
npm run check:dependencies
```

The repository contains no tests by instruction. `check` runs ESLint with zero warnings allowed, route-aware TypeScript, Next.js editor plugin diagnostics, display-string checks, semantic-color checks, shared-control checks, and Tailwind canonical-class checks. Keep the npm lockfile committed. A weekly dependency audit and Dependabot updates are configured under `.github/`; see [dependency maintenance](docs/DEPENDENCIES.md).

## Find your way around

- [AGENTS.md](AGENTS.md): concise agent landing page and task index.
- [Architecture](docs/ARCHITECTURE.md): modules, services, browser/server boundaries, state ownership.
- [Demo mode](docs/DEMO_MODE.md), [authentication](docs/AUTH.md), [realtime](docs/REALTIME.md), [analytics](docs/ANALYTICS.md).
- [Strings](docs/STRINGS.md): all display copy is centralized in `src/strings.ts`.
- [New project checklist](docs/NEW_PROJECT_CHECKLIST.md), [migration notes](docs/MIGRATION.md).
- [Design](DESIGN.md), [UX contract](UX-CONTRACT.md), [verification](docs/VERIFICATION.md).
