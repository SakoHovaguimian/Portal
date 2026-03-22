# New Service Prompt

Use this prompt when adding a new foundational or domain service.

## Prompt
Implement a new service named `<ServiceName>` in this template using interface + concrete implementation.

Follow this structure:

1. Define interface
- Add the public service contract in `packages/core/src/services/interfaces.ts`.
- Keep input/output types explicit and canonical.

2. Implement service
- Add the implementation in `packages/core/src/services/implementations.ts` or split into a dedicated file when the service grows.
- Services own orchestration, business rules, ownership enforcement, and error branching.

3. Repository dependencies
- Inject repository interfaces only.
- Do not import transport implementations directly into services.

4. Container wiring
- Register the service in `packages/core/src/container/serviceContainer.ts`.
- Keep dependency resolution explicit and discoverable.

5. UI exposure
- If the service is used by routes, add controller/composer/query hook updates in the app layer.
- Do not resolve services ad hoc deep inside components.

6. Error semantics
- Convert low-level failures into meaningful domain errors.
- Avoid leaking raw implementation details into UI copy.

7. Input validation
- Validate inputs using the `validateInput()` helper with Zod schemas.
- This provides defense-in-depth at the service boundary.

8. Verify
- Run `pnpm typecheck` after changes.
- Confirm the service can be mocked/swapped cleanly through the container.

## Reference patterns in this repo
- Auth/session service
- Feature request ownership service
- Dashboard orchestration service
