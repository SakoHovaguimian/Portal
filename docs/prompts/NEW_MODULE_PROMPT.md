# New Module Prompt

Use this prompt when adding a brand new feature module to this template.

## Quick Start: Use the Generator

For most new features, start with the code generator:

```bash
pnpm generate:feature <feature-name>
```

This creates boilerplate for:
- Domain model (`packages/core/src/models/<feature>.ts`)
- Feature screens and hooks (`apps/web/features/<feature>s/`)
- Controller adapter (`apps/web/controllers/<feature>sController.ts`)
- Route pages (`apps/web/app/(protected)/<feature>s/`)
- Barrel export (`apps/web/features/<feature>s/index.ts`)

Then follow the generated `_INSTRUCTIONS.md` file for manual integration steps.

## Manual Implementation Sequence

If not using the generator, follow this sequence:

1. **Canonical domain model**
   - Add Zod schemas in `packages/core/src/models/<feature>.ts`
   - Add query schema in `packages/core/src/models/query.ts`
   - Export from `packages/core/src/index.ts`

2. **Repository interface**
   - Add interface in `packages/core/src/repositories/interfaces.ts`

3. **Repository implementation**
   - Add implementation in `packages/api-sdk/src/repositories/`
   - Include domain mapper functions

4. **Service**
   - Add interface in `packages/core/src/services/interfaces.ts`
   - Add implementation in `packages/core/src/services/implementations.ts`
   - Include input validation with `validateInput()` helper

5. **Query keys (typed)**
   - Add to `packages/core/src/queries/queryKeys.ts` using the query-key-factory pattern:
   ```typescript
   featureName: {
     all: null,
     list: (query: string) => [query],
     detail: (id: string) => [id],
   },
   ```
   - Add stale time in `staleTimes` object

6. **Service container**
   - Wire repository and service in `packages/core/src/container/serviceContainer.ts`
   - Update client container in `apps/web/lib/client/container.ts`
   - Update server container in `apps/web/lib/server/container.ts`

7. **Feature folder**
   - Create `apps/web/features/<feature>s/`
   - Add `index.ts` barrel export
   - Add `hooks.ts` with typed query keys (use `.queryKey` property)
   - Add screens using `<QueryBoundary>` for error handling

8. **Controller + Composer**
   - Add controller in `apps/web/controllers/`
   - Add composer functions in `apps/web/composers/serverQueries.ts`

9. **Routes**
   - Add pages in `apps/web/app/(protected)/<feature>s/`

10. **Verify**
    - Run `pnpm typecheck` and `pnpm build`

## Non-negotiable Semantics

- Features must have a barrel export (`index.ts`)
- Features cannot import from other features (enforced by ESLint)
- Use `<QueryBoundary>` for consistent error handling
- Use typed query keys with `.queryKey` property
- Validate service inputs with `validateInput()` helper
- Never call repositories from React components
