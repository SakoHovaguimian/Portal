# New Project Checklist

Use this checklist every time this template is used as a project starter.

## 0) Scope Discovery (Required Before Scaffolding)
- [ ] Confirm whether auth is required for the project (`yes` / `no`).
- [ ] If auth is not required, remove login/signup menu actions from starter navigation.
- [ ] Confirm whether this project starts as a `hero page` or a `portal`.
- [ ] If `hero page`, start with a full-page marketing/storytelling surface.
- [ ] If `portal`, start with side-panel navigation and app-shell structure.
- [ ] Define initial header menu options, footer links, and required page sections.
- [ ] For hero-page starts, define section ordering and aesthetic behavior (visual direction, tone, spacing, motion).

## 1) Product Identity
- [ ] Rename app/product constants in `.env.local`, `README.md`, and route copy.
- [ ] Replace template navigation labels, dashboard copy, and login text.
- [ ] Replace mock seed users and feature request content with project-relevant fixtures.
- [ ] Update deployment metadata, environment names, and hosting targets.

## 2) Credentials and Secrets
- [ ] Generate project-specific Firebase web and admin credentials.
- [ ] Generate a long `SESSION_SECRET` for signed session cookies.
- [ ] Configure Sentry DSN and project settings when telemetry is desired.
- [ ] Ensure `.env.local` is local-only and never committed.

## 3) Auth and Bootstrap Helpers
- [ ] Decide when to disable `NEXT_PUBLIC_ENABLE_MOCK_AUTH`.
- [ ] Confirm Firebase emulator usage policy for local and CI workflows.
- [ ] Review `/api/auth/session` and `/api/auth/logout` behavior for production readiness.
- [ ] Confirm protected-route coverage in `apps/web/middleware.ts`.

## 4) API Contract Source of Truth
- [ ] Replace `packages/api-sdk/openapi/mock-openapi.json` with the real backend contract when ready.
- [ ] Regenerate transport types with `pnpm api:generate`.
- [ ] Confirm repositories still map transport payloads into canonical domain models correctly.
- [ ] Add contract drift checks to CI before launch.

## 5) Module Activation
- [ ] Remove feature modules not in product scope.
- [ ] Confirm `Users`, `Feature Requests`, `Dashboard`, and `Settings` are either productized or intentionally removed.
- [ ] Add module docs/prompts when introducing new major surfaces.

## 6) Theme and Design Policy
- [ ] Replace template accent/theme defaults if brand requirements demand it.
- [ ] Confirm semantic tokens cover all intended UI surfaces before adding ad hoc styling.
- [ ] Confirm typography choices are approved for the product.

## 7) Quality Gates
- [ ] CI runs `pnpm api:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and required tests.
- [ ] Smoke E2E flows cover auth, dashboard, users, feature requests, and theme persistence.
- [ ] Release is blocked when contract or type checks fail.

## 8) Final Pre-Launch Review
- [ ] Boot locally using only project-specific config.
- [ ] Confirm all protected routes enforce auth correctly.
- [ ] Confirm no mock/template branding remains.
- [ ] Confirm the frontend contract matches the intended backend public surface.
