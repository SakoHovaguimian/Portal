# Portal
<img width="1024" height="1024" alt="ChatGPT Image Mar 21, 2026 at 10_22_40 PM" src="https://github.com/user-attachments/assets/c88cee85-ad1c-4319-94ce-20dc8f98aee6" />

TypeScript frontend starter built on Next.js App Router, TanStack Query, Zustand, and a handwritten service container.

This repo is a base template for new frontend projects. It is intentionally opinionated around layering, canonical domain models, ownership-safe flows, and low-drift API contracts.

## Stack
- Next.js App Router + React 19
- TypeScript strict mode
- pnpm workspaces + Turborepo
- TanStack Query + Zustand
- Zod canonical domain schemas
- Mock OpenAPI transport SDK via `openapi-typescript`
- Firebase-ready auth with server-readable session cookies
- Untitled UI-inspired semantic design system on Tailwind CSS v4
- Sentry-ready telemetry

## Quick Start (Local)
1. Install workspace dependencies:
```bash
corepack enable
corepack prepare pnpm@10.6.0 --activate
pnpm install
```
2. Copy env values:
```bash
cp .env.example .env.local
```
3. Generate transport types from the checked-in mock contract:
```bash
pnpm api:generate
```
4. Start the web app:
```bash
pnpm dev:web
```
5. Open the app:
- `http://localhost:3001`

Default mock login:
- Email: `sako@example.com`
- Password: `password123`

## Local Commands (Keep)
```bash
pnpm dev
pnpm dev:web
pnpm dev:auth
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm api:generate
pnpm api:check
pnpm clean
```

## Firebase Emulator Notes
- `pnpm dev:auth` starts the Firebase Auth emulator when `firebase-tools` is installed through the workspace.
- Keep `NEXT_PUBLIC_ENABLE_MOCK_AUTH=true` for an out-of-the-box local starter.
- Flip mock auth off only after real Firebase web/admin credentials are configured.

## Architecture Overview
Boot flow:
1. `apps/web/app/layout.tsx` sets root theme/runtime shell.
2. `apps/web/app/(protected)/layout.tsx` reads the signed session cookie and composes the protected app shell.
3. `apps/web/providers/AppProviders.tsx` creates the browser-side `ServiceContainer` and React Query client.
4. `apps/web/composers/serverQueries.ts` prefetches route data through controllers + services for SSR hydration.
5. `packages/core/src/container/serviceContainer.ts` wires repositories to services explicitly.

Request/data flow:
1. Next route segment/page
2. Controller adapter (`apps/web/controllers/*`)
3. Core service (`packages/core/src/services/*`)
4. Repository interface (`packages/core/src/repositories/*`)
5. Repository implementation (`packages/api-sdk/src/repositories/*`)
6. Transport client / transport mapper (`packages/api-sdk/src/client/*`, `packages/api-sdk/src/mappers/*`)

## Layer Responsibilities
Route / App Router:
- Route composition only.
- No business logic.
- No raw transport calls.

Controller:
- Parse route params/search params/form input.
- Normalize input with Zod.
- Call services.

Service:
- Business rules and ownership invariants.
- Current-user enforcement.
- Mutation orchestration.

Repository:
- Transport-only concerns.
- Call generated or typed client methods.
- Map transport models into canonical domain models.

UI:
- Render canonical models only.
- Use semantic tokens only.
- No repository access.

## Project Patterns and Semantics
### 1) Single canonical entity models
- Domain entities keep one canonical model type/schema (`User`, `FeatureRequest`).
- Transport shapes stay isolated in `packages/api-sdk`.

### 2) Ownership invariants are trusted-context derived
- Never trust mutable ownership fields from browser payloads.
- `userId` for feature requests comes from the authenticated session, not the form.

### 3) Repository mapping boundary
- OpenAPI types are transport contracts.
- Zod schemas in `packages/core` are domain contracts.
- Repositories are the only transport-to-domain translation boundary.

### 4) Query ownership
- TanStack Query owns server truth.
- Zustand owns ephemeral dashboard chrome only.
- URL owns bookmarkable filters/tabs/sort.
- `localStorage` owns theme mode/accent only.

### 5) Theme semantics
- Feature code uses semantic tokens, not raw colors.
- Runtime theme state lives on `data-theme` and `data-accent`.

## Mock OpenAPI Workflow
Initial source of truth:
- `packages/api-sdk/openapi/mock-openapi.json`

Generated output:
- `packages/api-sdk/generated/schema.d.ts`

Commands:
```bash
pnpm api:generate
pnpm api:check
```

When replacing the mock API with the real Hono backend later:
1. Export or fetch the real backend OpenAPI document.
2. Replace `packages/api-sdk/openapi/mock-openapi.json`.
3. Run `pnpm api:generate`.
4. Update repository implementations only if transport contracts changed.
5. Keep canonical domain models and service contracts stable whenever possible.

## Route Summary
Public routes:
- `/login`

Protected routes:
- `/dashboard`
- `/experience`
- `/users`
- `/users/[id]`
- `/profile`
- `/feature-requests`
- `/feature-requests/[id]`
- `/settings/appearance`

## Package Map
- `apps/web`: Next app entry, routes, controllers, composers, providers, feature assembly
- `packages/core`: canonical schemas, errors, repository interfaces, services, query keys, theme contracts
- `packages/api-sdk`: mock OpenAPI contract, generated transport types, typed client, mock repositories, transport mappers
- `packages/ui`: semantic tokens, layout shell, Radix-wrapped primitives, shared display components
- `packages/config`: shared tsconfig, eslint, prettier, vitest, playwright presets

## Docs
- New project checklist: `docs/NEW_PROJECT_CHECKLIST.md`
- New project template prompt: `docs/prompts/NEW_PROJECT_TEMPLATE_PROMPT.md`
- Repo semantics prompt: `docs/prompts/REPO_SEMANTICS_PROMPT.md`
- New module implementation prompt: `docs/prompts/NEW_MODULE_PROMPT.md`
- New service implementation prompt: `docs/prompts/NEW_SERVICE_PROMPT.md`
- New controller adapter prompt: `docs/prompts/NEW_CONTROLLER_ADAPTER_PROMPT.md`
- New query hook family prompt: `docs/prompts/NEW_QUERY_HOOK_FAMILY_PROMPT.md`
- New dashboard resource prompt: `docs/prompts/NEW_DASHBOARD_RESOURCE_PROMPT.md`
