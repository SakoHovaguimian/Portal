# Project decisions

Copy this file into the new product’s language and keep it current.

| Decision | Selected value | Rationale / contract | Owner | Status |
| --- | --- | --- | --- | --- |
| Product name | Portal | Template identity | Product owner | Template default |
| Primary audience | Product teams | Reusable starting point | Product owner | Template default |
| Authentication | No auth | Self-contained demo | Engineering | Replace or approve |
| Signup policy | Demo flow | No account is stored | Product | Replace or approve |
| Authorization | None | Example UI only | Engineering | Replace |
| Backend | Optional proxy | `PORTAL_API_URL` | Engineering | Decide |
| Persistence | Static example data | No durable writes | Engineering | Decide |
| Realtime/WebSockets | Disabled | `PORTAL_REALTIME_MODE=none` | Engineering | Decide |
| Notifications | Disabled | No permission prompts | Product | Decide |
| Uploads | Disabled | No storage configured | Product | Decide |
| Search | Local examples only | No remote index | Product | Decide |
| Email | Disabled | Password reset is simulated outside Firebase mode | Product | Decide |
| Analytics | Disabled | No tracking code | Product | Decide |
| Payments | Disabled | No billing code | Product | Decide |
| Localization | English source catalog | No locale runtime | Product | Decide |
| Hosting | Local repository | No deployment configured | Engineering | Decide |

## Required product context

- One-sentence promise:
- Primary user:
- Primary user action:
- Workspace/tenant boundary:
- Roles and permissions:
- Sensitive data:
- Retention/deletion requirements:
- Supported platforms:
- Launch owner:
