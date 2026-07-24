# Strings and linting

Application-owned user-facing copy belongs in `src/content/strings.ts`.

## Why

- Product language remains reviewable in one place.
- Rebranding and terminology audits are reliable.
- Localization can be added without first extracting scattered literals.
- Components focus on structure and behavior.

## Enforcement

`portal/no-raw-user-facing-strings` checks TSX for:

- visible JSX text;
- literal `label`, `title`, `description`, `placeholder`, `alt`, and `aria-label` attributes;
- literal string expressions inside JSX.

Dynamic API content and structured demo data are not required to live in the catalog. Error codes, route paths, CSS classes, event names, and developer-only diagnostics are not interface copy.

Run:

```bash
npm run lint
npm run check
```

Do not disable the rule to land copy. Add a meaningful catalog key and reference it.

## Localization

The current catalog is English-only. Before adding locales, decide routing, locale negotiation, fallback behavior, plurals, rich text, dates, time zones, currencies, translation ownership, and whether server/API content is localized separately.
