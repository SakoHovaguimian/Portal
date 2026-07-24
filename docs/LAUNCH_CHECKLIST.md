# Launch checklist

## Product

- [ ] No template name, demo person, example email, placeholder metric, or sample event remains.
- [ ] Marketing promise, navigation, CTA, onboarding, empty states, and support paths match the real product.
- [ ] Terms and privacy content received qualified review.

## Access and data

- [ ] Authentication mode is intentional and fully configured.
- [ ] Signup policy, email verification, recovery, logout, revocation, and deletion work.
- [ ] Every read and mutation enforces tenant and role authorization.
- [ ] Secrets are server-only and environment-specific.
- [ ] Data retention, export, deletion, backups, and restore verification are documented.
- [ ] Upload and webhook endpoints validate payloads, size, origin, and authorization.

## Experience

- [ ] Mobile, desktop, keyboard, screen reader, zoom, contrast, reduced motion, loading, empty, error, and offline/degraded states are reviewed.
- [ ] Titles, descriptions, canonical URLs, favicon, social image, robots, and sitemap are production-ready.
- [ ] Browser support and performance budgets are defined.

## Operations

- [ ] Analytics consent and event taxonomy are approved.
- [ ] Logs and error monitoring exclude credentials and unnecessary personal data.
- [ ] Alerts have owners and runbooks.
- [ ] Database migrations, environment promotion, rollback, and incident communication are rehearsed.
- [ ] Rate limits and abuse protections are enabled.

## Verification

- [ ] `npm run theme:build`
- [ ] `npm run check`
- [ ] `npm run build`
- [ ] Residual audit for `Portal`, `portal`, `example.com`, `TODO`, and placeholder legal copy
- [ ] Unselected dependencies, routes, variables, assets, and docs claims removed
