# Repo Semantics Prompt

Use this prompt when you need to implement or refactor repository code in this template.

## Prompt
You are implementing repository code for a Next.js + TypeScript semantic web template with strict layering.

Follow these rules exactly:

1. Repository scope
- Repository methods only perform transport access and mapping.
- No React component concerns.
- No route/search/form parsing.
- No business or ownership decisions beyond already-trusted inputs.

2. Domain model shape
- Use one canonical model per entity (`User`, `FeatureRequest`, etc).
- Do not create parallel `*ViewData` or `*Response` domain models without a justified layer boundary.
- Map transport records to canonical models in dedicated mapper helpers.

3. Error handling
- Normalize transport failures into typed domain-safe errors.
- Preserve known domain errors (`401`, `403`, `404`, `409`) instead of collapsing everything into a generic failure.
- Do not leak raw HTTP internals into UI-facing layers.

4. Query behavior
- Trim search strings before filtering.
- Keep query conventions aligned with shared query contracts and query keys.
- Avoid ad hoc query shapes invented inside repositories.

5. Ownership and mutable keys
- Repositories should accept `id`/`userId` values already resolved by service/controller.
- Never derive ownership from raw form payload assumptions in the repo layer.

6. Return values
- Return canonical model objects, paginated results, or `null` where intended.
- No transport types should leak past the repository boundary.

7. Code style
- Keep methods explicit and transport-only.
- Prefer small mapper helpers over repeated inline remapping.

8. Verification
- Run `pnpm typecheck` after changes.
- Confirm no services/controllers/components are now depending on transport-specific details.

## Expected output format
- List files changed.
- Explain mapper and error translation decisions.
- Note any contract regeneration or doc updates required.
