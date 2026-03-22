# New Controller Adapter Prompt

Use this prompt when adding or refactoring a controller adapter near the Next app layer.

## Prompt
Implement a new controller adapter named `<ControllerName>` for this semantic frontend template.

Follow these rules exactly:

1. Controller scope
- Read route params, search params, or mutation payload input.
- Validate and normalize with shared Zod contracts.
- Call services only.
- Return page-ready state or mutation-ready input.

2. Forbidden behavior
- No repository calls.
- No transport types.
- No design-system rendering concerns.
- No giant god-object behavior.

3. Ownership rules
- Pass trusted auth/session context into services instead of trusting raw payload ownership fields.

4. Search and URL state
- Keep bookmarkable state in URL-friendly contracts.
- Do not invent route-specific ad hoc parsing when a shared query contract exists.

5. Verification
- Confirm the matching composer/query hooks/pages still use the controller boundary.

## Expected output format
- List files changed.
- Explain which inputs are parsed and why they belong in the controller.
