# Theme and branding

The editable source of truth is `src/theme/portalDesignSystem.ts`. Generated theme artifacts live in `src/theme/generated` and should not be edited directly.

## Rebrand sequence

1. Replace product name and copy catalog values.
2. Replace `PortalLogo` and favicon.
3. Update accent, neutrals, typography, radii, motion, shadows, and semantic tokens.
4. Run `npm run theme:build`.
5. Review marketing, auth, portal, legal, loading, error, and empty states in light and dark modes.
6. Replace the Open Graph image and metadata.

Prefer semantic roles such as accent, success, warning, error, surface, muted, border, and primary text over product-specific color names.
