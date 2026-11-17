# Adding And Removing Features

Each feature declares its navigation, page paths, API ownership, demo handler, demo resets, and optional live adapter in its own module file. [Chat](../src/modules/chat/chatModule.ts) is a complete example. [The registry](../src/config/portalModuleRegistry.ts) imports those declarations and preserves request-handler order.

| Feature          | Declaration                                             | Copy                                                                        |
| ---------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| Account Tools    | `src/modules/account-tools/accountToolsModule.ts`       | `portalAccountToolsStrings`, `portalHelpFaqSections`                        |
| Background Jobs  | `src/modules/background-jobs/backgroundJobsModule.ts`   | `portalJobStrings`                                                          |
| Publishing       | `src/modules/blog/publishingModule.ts`                  | `portalPublishingStrings`                                                   |
| Chat             | `src/modules/chat/chatModule.ts`                        | `portalChatStrings`, legacy `strings.chat`                                  |
| Dashboard        | `src/modules/dashboard/dashboardModule.ts`              | `strings.ui.dashboardScreen`                                                |
| Engagement       | `src/modules/engagement/engagementModule.ts`            | `portalEngagementStrings`                                                   |
| Feature Requests | `src/modules/feature-requests/featureRequestsModule.ts` | `strings.ui.featureRequestsScreen`, `strings.ui.featureRequestDetailScreen` |
| Notifications    | `src/modules/notification-inbox/notificationsModule.ts` | `portalNotificationInboxStrings`                                            |
| Onboarding       | `src/modules/onboarding/onboardingModule.ts`            | `portalOnboardingStrings`                                                   |
| Users            | `src/modules/users/usersModule.ts`                      | `strings.ui.usersScreen`, `strings.ui.userDetailScreen`                     |
| Public Media     | `src/services/media/mediaModule.ts`                     | `portalMediaStrings`                                                        |

Every copy bucket in this table lives in the single [strings file](../src/strings.ts). Its labeled sections group feature copy, shared controls, demo content, and CLI instructions. Country and region reference data lives in [addressCountries](../src/components/ui/data/addressCountries.ts).

## Disable Features For A New Project

Set the relevant capability to `false` in [projectConfiguration](../src/config/projectConfiguration.ts), or select capabilities with the initializer. Restart the app after changing project configuration.

The declaration supplies navigation destinations and API ownership rules. Disabled capabilities disappear from navigation, stop registering demo handlers/resets and live adapters, and return 404 at their existing page/API boundaries. The initializer still controls project identity, capability selections, and navigation order.

Keep profile editing available when disabling Users. Its declaration exempts the authenticated user's own profile API paths, and the demo core retains profile reads and updates.

## Remove A Feature From A Clone

For Chat:

1. Disable `modules.chat` and remove `chat` from the configured navigation.
2. Remove the `chatModule` import and list entry from `src/config/portalModuleRegistry.ts`.
3. Delete `src/modules/chat/` and `src/app/(protected)/chat/`.
4. Remove the `ChatService` import and `chatService` property from `src/clientContainer.ts`.
5. Search remaining references with `rg -n 'chat|Chat' src scripts docs`. Remove Chat from initializer choices/profiles and the configuration model if the clone will keep using the initializer. Review copy, fixtures, proxy matchers, realtime events, and backend contracts according to the product's needs.
6. Run `npm run check`, `DEMO_MODE=true npm run build`, and the affected local demo workflows.

The shared sidebar, demo dispatcher, live adapter dispatcher, and API availability checker consume the registry. Chat's compatibility message endpoint and its state live inside the Chat module. Demo notification destinations fall back to the configured home page when their feature is unavailable.

Review cross-feature dependencies when removing other modules. Dashboard displays Users and Feature Requests data. Engagement resolves published articles. Onboarding coordinates authentication and API access. Shared account identity/profile behavior remains part of the application's foundation.

## Add A Feature

1. Add the domain service, models, hooks, screen, and Next.js route files following the [module guide](prompts/NEW_MODULE_PROMPT.md). Register browser service construction in `src/clientContainer.ts`.
2. Add its capability and navigation ID to `ProjectConfiguration`, the project's selections, and the initializer's choices/profiles.
3. Create a server-only `<feature>Module.ts` declaration using `PortalModule`. Declare each navigation destination's route, catalog label, and icon. Use `staffHref` for content-management destinations. Declare additional page paths and API ownership checks beside the handler.
4. Declare `demo.handle` and the applicable `reset` and `resetAccount` callbacks. The handler receives the authenticated account, request helpers, simulation state, and public project routing. Return `null` when a request belongs to another handler. Define `live` only when the browser contract requires an adapter.
5. Import the declaration once into `portalModuleRegistry.ts`. Media must run before Publishing because both recognize the legacy blog upload path.
6. Put copy in the matching section of `src/strings.ts`. Use screen, action, validation, and demo subgroups when the feature needs them. Keep existing catalog paths stable during unrelated edits.
7. Document backend contracts and verify enabled/disabled behavior, ownership, validation, navigation, demo reset, and account cleanup.

## Browser And Server Boundaries

Module declarations import server-only demo/live code. The registry and `getProjectRouting()` remain server-only. The root layout passes serializable navigation and redirect rules through `RuntimeProvider`; client components use `useProjectRouting()`. Icon names become React elements only in the sidebar composer.

`demoModuleHandlers`, `featureBackendProxy`, and `moduleAvailability` iterate the declarations. `DemoApiClient` applies request simulation once and retains shared authentication/profile behavior. Core identity reset stays in `demoState`; feature resets register from their declarations. The notification demo receives routing in its request/reset context so its state does not import the registry.
