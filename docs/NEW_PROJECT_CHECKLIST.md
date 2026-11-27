# New project checklist

1. Read [AGENTS.md](../AGENTS.md) and [architecture](ARCHITECTURE.md). Use Node 22 and npm.
2. Run `npm run initialize -- --help`; preview the chosen profile with `--dry-run`, then initialize the new project. Existing environment/configuration requires deliberate `--force`. Alternatively copy `.env.example` to `.env.local`. Run the demo before adding external dependencies. See [initializer](PROJECT_INITIALIZER.md).
3. Update product identity and all copy through `src/strings.ts`. Keep token ownership in [DESIGN.md](../DESIGN.md).
4. Choose capabilities and navigation order in `src/config/projectConfiguration.ts`; `portalModules.ts` and `portalNavigation.tsx` consume them. Open `/dev-settings/components`; choose theme defaults and reuse the shared controls, motion, page patterns, and mobile layouts. Read [UI system](UI_SYSTEM.md).
5. Set a strong live session secret and Firebase web API key. Choose a persistent location for the session database. See [authentication and sessions](AUTH.md).
6. Align the backend with [BACKEND_CONTRACT.md](BACKEND_CONTRACT.md); adapt domain services and demo routes together.
7. Use the [feature generator](MODULES.md#add-a-feature) for an account-owned collection, or follow the manual wiring guide for other domains. Keep new, empty, and onboarding identities free of seeded private activity. Choose optional [publishing](BLOG.md), inbox, account tools, and onboarding contracts deliberately. Live onboarding requires its environment opt-in.
8. Set `PORTAL_PRIVACY_NOTICE_URL` to the deployment's public HTTPS privacy notice. Review the privacy and accessibility checks below. Configure optional socket, Messaging, and Amplitude values only for enabled features.
9. Run `npm run check:dependencies`, `npm run check`, `DEMO_MODE=true npm run build`, and focused browser flows. Do not write tests or run Xcode builds.
10. Record verified external integrations and remaining deployment configuration. Update the agent index and focused guides.

## Privacy And Accessibility At Launch

- Open `/privacy` signed out and follow the notice link. The template's fallback describes the controls and storage. Publish the operator's notice with the actual data purposes, applicable legal bases, recipients, retention, privacy rights, and contact details before collecting production data.
- Inventory the session cookie, local preferences, analytics choice, and any enabled push or embeds. Include server-side data such as hosting logs, sessions, backend records, vendor data, and backups. Assign owners and retention periods, and verify what account deletion covers. Document how people can request access, correction, deletion, or a copy where applicable.
- When enabling [analytics](ANALYTICS.md), choose the Amplitude region used by the project and check accept, decline, and withdrawal on a deployed preview. Confirm the payload and storage in browser developer tools. Review any market-specific device-storage requirements and whether the deployment owes a sale or sharing opt-out or must honor Global Privacy Control. Verify [push](REALTIME.md) and [third-party media](BLOG.md) separately if enabled.
- Target WCAG 2.2 AA. Check the deployed theme in light and dark at narrow widths and browser zoom. Walk sign-in, signup, consent, navigation, and core forms by keyboard and with an available screen reader. Include first-invalid-field focus, Escape and focus restoration, contrast, readable tables, visible focus around overlays, and reduced motion.
