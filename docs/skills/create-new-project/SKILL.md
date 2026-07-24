---
name: create-new-portal-project
description: Convert Portal into a new product by interviewing the owner, recording explicit capability decisions, then applying the approved configuration without carrying template assumptions into production.
---

# Create a new Portal project

Use this workflow whenever Portal becomes a real product.

## Non-negotiable behavior

1. Inspect `AGENTS.md`, `docs/PROJECT_DECISIONS.md`, `docs/FEATURE_MATRIX.md`, `.env.example`, `package.json`, `src/config/environment.ts`, and the relevant Next.js 16 guides in `node_modules/next/dist/docs/`.
2. Ask one decision question at a time. Do not dump the whole checklist on the owner.
3. For each question, briefly state the recommended answer and the tradeoff.
4. Record the approved answer in `docs/PROJECT_DECISIONS.md` immediately.
5. Do not edit product code until every blocking decision below is resolved and the owner approves the summary.
6. If a capability is not selected, remove its code, dependency, environment variables, docs claims, and UI.
7. Do not invent provider credentials, legal language, analytics events, roles, data retention, or backend contracts.

## Interview sequence

Ask these in order, skipping only decisions already documented:

1. Product identity: name, one-sentence promise, audience, primary action, public URL.
2. Portal shape: internal admin, customer portal, member workspace, marketplace, operations console, or hybrid.
3. Authentication: **Firebase**, **no auth**, or **custom auth**. If custom, ask for provider/library and session model.
4. Account creation: public signup, invite-only, admin-provisioned, or disabled.
5. Authorization: roles, permissions, tenant/workspace boundary, and who manages access.
6. Backend: existing API, new API, Next.js route handlers, direct database access, or static/local data.
7. Persistence: none, browser-local, relational database, document database, or external system of record.
8. Realtime/WebSockets: **yes or no**. If yes, define events, ordering, reconnect behavior, ticket/auth mechanism, and degraded mode.
9. Notifications: none, in-app, email, browser push, SMS, or a combination. Ask about consent and preferences.
10. Uploads: none or yes. If yes, define file types, size limits, storage, scanning, retention, visibility, and deletion.
11. Search: none, local filtering, API search, or dedicated search service.
12. Email: none, transactional, lifecycle, or marketing. Identify provider and required templates.
13. Analytics and observability: provider, consent requirements, event taxonomy, error monitoring, logs, and alert ownership.
14. Payments: none or provider/billing model.
15. Localization: one locale or multiple; confirm date, time, currency, and plural rules.
16. Accessibility target and supported browsers/devices.
17. Legal/compliance: regions, privacy obligations, data retention, account deletion, audit requirements.
18. Hosting: platform, environments, preview strategy, domains, secrets, migrations, and rollback.
19. Template examples: which example routes and sample data should remain during development.
20. Testing rule: confirm whether the repository’s current “no tests unless explicitly requested” instruction remains.

## Approval gate

Present a compact summary grouped by product/users, identity/permissions, data/integrations, realtime/communications, operations/compliance, and template modules to keep/remove. Ask for explicit approval. Only then implement.

## Implementation sequence

1. Rename package, metadata, copy catalog, theme source, cookies/storage keys, environment names, and docs.
2. Replace example models one focused file at a time.
3. Build the data/service boundary before wiring screens.
4. Implement authorization close to the data source, not only in layouts.
5. Replace or remove example routes.
6. Remove unused packages and variables.
7. Run `npm run theme:build`, `npm run check`, and `npm run build`.
8. Complete `docs/LAUNCH_CHECKLIST.md`.
9. Audit for `Portal`, `portal`, `example.com`, demo names, placeholder legal copy, and unselected capabilities.
