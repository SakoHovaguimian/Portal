# New Dashboard Resource Prompt

Use this prompt when onboarding a new resource into the dashboard explorer/overview surface.

## Prompt
Add a new dashboard resource named `<ResourceName>` to this template.

Use this exact sequence:

1. Canonical model readiness
- Confirm the resource already has a canonical domain model and repository/service support.

2. Dashboard repository support
- Extend dashboard repository data so overview/model summaries/records can surface the resource.
- Keep transport mapping and model metadata explicit.

3. Query and composer support
- Update dashboard query hooks and any server prefetch composers as needed.

4. UI exposure
- Ensure the model appears in overview summaries, model lists, and record explorer flows.
- Keep the operational dashboard feel information-dense and consistent.

5. Governance
- Update README and prompts when the new resource changes contributor workflow.

## Non-negotiable semantics
- No resource should appear in the dashboard without explicit metadata.
- Sensitive fields should remain clearly marked and intentionally rendered.
- Dashboard onboarding is incomplete if overview and explorer surfaces drift apart.
