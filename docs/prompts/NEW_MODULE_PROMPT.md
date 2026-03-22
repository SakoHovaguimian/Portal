# New Module Prompt

Use this prompt when adding a brand new feature module to this template.

## Prompt
Implement a new feature module named `<ModuleName>` in this semantic frontend template.

Use this exact sequence and semantics:

1. Canonical domain model
- Add canonical schemas/types in `packages/core/src/models`.
- Add query/filter/mutation contracts when needed.
- Keep one canonical entity model whenever possible.

2. Repository interface
- Add repository interface methods in `packages/core/src/repositories/interfaces.ts`.
- Keep contracts transport-agnostic.

3. Repository implementation
- Add transport mapping and implementation in `packages/api-sdk/src/repositories`.
- Keep transport-to-domain translation isolated there.

4. Service interface + service
- Add service contract and implementation in `packages/core/src/services`.
- Services own business rules, orchestration, and ownership invariants.

5. Query standards
- Add query keys and stale-time/invalidation guidance in `packages/core/src/queries/queryKeys.ts`.
- Add query hooks in `apps/web/features/<module>/hooks.ts`.

6. Controller adapter
- Add route/search/input parsing in `apps/web/controllers`.
- Normalize UI input before calling services.

7. Composer
- Add route-level prefetch composition in `apps/web/composers`.
- Prefetch through controllers/services, not directly through repositories.

8. UI
- Add screens/components in `apps/web/features/<module>`.
- Use canonical models only.
- Use semantic tokens/components from `@semantic-web/ui`.

9. Routing
- Add route segments in `apps/web/app`.
- Keep page files thin and composition-only.

10. Docs update
- Update `README.md` route/module summary when the surface is user-visible.
- Add or update prompts if the module introduces a repeatable architecture pattern.

11. Verify
- Run `pnpm typecheck`, `pnpm build`, and relevant tests.

## Non-negotiable template semantics
- Do not call repositories from React components.
- Do not trust mutable ownership fields from UI payloads.
- Do not let transport types leak into UI or services.
- New module work is not complete unless query keys, controller/composer wiring, and docs are updated.
