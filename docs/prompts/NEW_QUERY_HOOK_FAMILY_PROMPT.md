# New Query Hook Family Prompt

Use this prompt when adding TanStack Query hooks for a new feature.

## Prompt
Implement a new query hook family for `<FeatureName>` in this template.

Follow these rules exactly:

1. Query key policy
- Add canonical query keys in `packages/core/src/queries/queryKeys.ts` first.
- No ad hoc string keys in components.

2. Hook location
- Add hooks in `apps/web/features/<feature>/hooks.ts`.
- Hooks should call services through the service container context.

3. Ownership
- Query hooks should not derive ownership-sensitive values from uncontrolled UI payloads.
- Use the service layer to enforce current-user assumptions.

4. Mutation invalidation
- Explicitly invalidate the correct list/detail/dashboard keys.
- Do not hide invalidation side effects deep in component trees.

5. UI responsibility
- Components consume hook results only.
- Components must not recreate query/mutation conventions inline.

6. Verify
- Confirm SSR prefetch composers still align with the same query keys.

## Expected output format
- List files changed.
- Document query keys, stale time, and invalidation behavior.
