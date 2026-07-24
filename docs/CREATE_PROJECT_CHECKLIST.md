# Create a project checklist

Use this only after completing the guided interview in `docs/skills/create-new-project/SKILL.md`.

## 1. Identity

- [ ] Replace `Portal` in package metadata, application metadata, docs, copy, and demo data.
- [ ] Replace the logo component and favicon.
- [ ] Set the canonical production URL.
- [ ] Define the product promise, audience, primary navigation, and primary CTA.
- [ ] Replace placeholder legal pages with reviewed documents.

## 2. Capability selection

- [ ] Authentication: no auth / Firebase / custom.
- [ ] Signup: public / invite-only / provisioned / disabled.
- [ ] Authorization roles and tenant boundary.
- [ ] Backend/API ownership and versioning.
- [ ] Persistence and migrations.
- [ ] WebSockets/realtime: yes / no.
- [ ] Browser push: yes / no.
- [ ] Email: yes / no.
- [ ] Uploads/storage: yes / no.
- [ ] Search: yes / no.
- [ ] Analytics: yes / no.
- [ ] Error monitoring and operational alerts.
- [ ] Payments: yes / no.
- [ ] Localization: yes / no.
- [ ] Offline/PWA behavior: yes / no.

## 3. Domain replacement

- [ ] Define the product’s ubiquitous language.
- [ ] Replace `portalActivity`, `portalMember`, `portalResource`, and `portalMetric` models.
- [ ] Replace static data in `src/modules/portal/data/portalDemoData.ts`.
- [ ] Rename routes and navigation for real user jobs.
- [ ] Define loading, empty, error, permission-denied, and first-run states.
- [ ] Define destructive operations and recovery behavior.

## 4. Security and privacy

- [ ] Keep secrets server-only; expose only intentional `NEXT_PUBLIC_` values.
- [ ] Validate every external payload with a schema.
- [ ] Authorize mutations and reads close to the data source.
- [ ] Define session expiration, refresh, revocation, and logout.
- [ ] Add rate limits for expensive or sensitive endpoints.
- [ ] Define upload validation, scanning, retention, and access.
- [ ] Document data collection, subprocessors, deletion, and export.
- [ ] Add CSP and other response headers appropriate to hosting.

## 5. Quality gate

- [ ] Run `npm run theme:build` after theme edits.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Verify light, dark, mobile, keyboard, reduced-motion, loading, empty, and error states.
- [ ] Audit raw user-facing copy.
- [ ] Audit example names, emails, metrics, links, and legal placeholders.
- [ ] Remove unused packages, environment variables, routes, docs claims, and assets.
- [ ] Complete `docs/LAUNCH_CHECKLIST.md`.
