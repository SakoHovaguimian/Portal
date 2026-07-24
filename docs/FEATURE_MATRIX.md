# Feature matrix

For every row, select **Keep**, **Replace**, or **Remove**. “Undecided” is not a launch state.

| Capability | Template state | Source / seam | Required decision |
| --- | --- | --- | --- |
| Marketing site | Example | `src/modules/marketing` | Replace copy, sections, CTA |
| Login/signup/recovery UI | Example | `src/modules/auth/components` | Keep flow, change fields, or remove |
| No-auth mode | Ready | `PORTAL_AUTH_MODE=none` | Development only or production |
| Firebase auth | Adapter ready | `src/services/auth` | Firebase project and signup policy |
| Custom auth | Integration seam | `PORTAL_AUTH_MODE=custom` | Provider, SDK, session contract |
| Encrypted session cookie | Ready for Firebase | `src/services/session` | Expiry, revocation, payload |
| Authorization | Not implemented | Product DAL/services | Roles and permission matrix |
| Portal shell | Example | `src/modules/portal/components/portalShell.tsx` | Navigation and account UI |
| Dashboard | Example | `dashboardPage.tsx` | Product metrics and actions |
| Activity feed | Example | `activityPage.tsx` | Event taxonomy and retention |
| Team/access list | Example | `teamPage.tsx` | Membership and role operations |
| Resource list | Example | `resourcesPage.tsx` | Replace with domain records |
| Backend proxy | Ready | `src/app/api/backend` | Upstream API and auth contract |
| Browser API client | Ready | `src/services/api/browserApiClient.ts` | Error envelope and caching |
| Server API client | Ready | `src/services/api/apiClient.ts` | Headers, versioning, retries |
| TanStack Query | Installed | `src/app/providers.tsx` | Query keys and cache policy |
| Socket.IO | Optional provider | `src/services/realtime` | Enable, remove, or replace |
| Browser push | Removed | Documentation only | Reintroduce only with consent design |
| Uploads | Removed | Documentation only | Storage/security contract |
| Search | UI primitives only | `src/components/forms/searchField.tsx` | Local/API/dedicated service |
| Theme system | Ready | `src/theme/portalDesignSystem.ts` | Brand tokens and typography |
| Light/dark mode | Ready | `src/components/theme` | Keep system behavior or simplify |
| String catalog | Required | `src/content/strings.ts` | Localization strategy |
| Copy lint | Required | `eslint-rules` | Keep enabled |
| Legal routes | Placeholder | `src/modules/legal` | Replace before launch |
| SEO/metadata | Example | `src/app/layout.tsx`, sitemap, robots | Production URL and indexing |
| Developer settings | Development-only | `/dev/settings` | Extend or remove |
| Analytics | Not installed | None | Provider, consent, taxonomy |
| Error monitoring | Not installed | None | Provider and PII policy |
| Email | Not installed | None | Provider, templates, delivery events |
| Payments | Not installed | None | Provider, products, webhooks |
| Localization runtime | Not installed | Catalog only | Locales and formatting |
